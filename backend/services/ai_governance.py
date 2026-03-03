"""AI Governance Engine for ContractGHOST.

Implements:
- Task classification and temperature routing
- Fallback architecture and confidence scoring
- Hallucination detection (evidence anchoring, numeric sanity)
- Citation verification and source attribution
- Human review gateway
- Audit record building
"""

import enum
import hashlib
import logging
import re
import time
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger("contractghost.ai_governance")

# ---------------------------------------------------------------------------
# Task Classification
# ---------------------------------------------------------------------------


class TaskType(str, enum.Enum):
    STRUCTURED_EXTRACTION = "structured_extraction"
    PRICING_MODEL = "pricing_model"
    EARNINGS_PARSING = "earnings_parsing"
    EXECUTIVE_PROFILING = "executive_profiling"
    BLOG_GENERATION = "blog_generation"
    TREND_DETECTION = "trend_detection"
    COMPANY_RESEARCH = "company_research"
    CALL_INTELLIGENCE = "call_intelligence"
    NEWS_EXTRACTION = "news_extraction"
    CLAIM_VERIFICATION = "claim_verification"


# Temperature and top_p matrix per task type (production values).
# Anything involving numbers: temperature <= 0.15.
# Anything creative: temperature <= 0.4. Never above 0.5.
TEMPERATURE_MATRIX: dict[TaskType, dict[str, float]] = {
    TaskType.STRUCTURED_EXTRACTION: {"temperature": 0.15, "top_p": 0.90},
    TaskType.PRICING_MODEL:         {"temperature": 0.05, "top_p": 0.70},
    TaskType.EARNINGS_PARSING:      {"temperature": 0.10, "top_p": 0.80},
    TaskType.EXECUTIVE_PROFILING:   {"temperature": 0.20, "top_p": 0.90},
    TaskType.BLOG_GENERATION:       {"temperature": 0.40, "top_p": 0.95},
    TaskType.TREND_DETECTION:       {"temperature": 0.10, "top_p": 0.80},
    TaskType.COMPANY_RESEARCH:      {"temperature": 0.15, "top_p": 0.90},
    TaskType.CALL_INTELLIGENCE:     {"temperature": 0.10, "top_p": 0.85},
    TaskType.NEWS_EXTRACTION:       {"temperature": 0.10, "top_p": 0.80},
    TaskType.CLAIM_VERIFICATION:    {"temperature": 0.05, "top_p": 0.70},
}

# Confidence thresholds
FALLBACK_CONFIDENCE_THRESHOLD = 0.6   # below → trigger fallback model
REVIEW_THRESHOLD = 0.65               # below → flag for human review
SUPPRESSION_THRESHOLD = 0.5          # below → suppress output entirely


def get_temperature_params(task_type: TaskType) -> dict[str, float]:
    """Return temperature and top_p for the given task type."""
    return TEMPERATURE_MATRIX.get(task_type, {"temperature": 0.15, "top_p": 0.90})


# ---------------------------------------------------------------------------
# Confidence Scoring
# ---------------------------------------------------------------------------


@dataclass
class ConfidenceFactors:
    evidence_strength: float = 0.0      # weight 0.4
    source_credibility: float = 0.0     # weight 0.2
    cross_model_agreement: float = 1.0  # weight 0.2 (default 1.0 when no cross-validation)
    data_completeness: float = 0.0      # weight 0.2


def compute_confidence(factors: ConfidenceFactors) -> float:
    """Compute composite confidence score (0–1)."""
    return (
        0.4 * factors.evidence_strength
        + 0.2 * factors.source_credibility
        + 0.2 * factors.cross_model_agreement
        + 0.2 * factors.data_completeness
    )


def assess_output_confidence(output: dict[str, Any], task_type: TaskType) -> float:
    """
    Heuristically assess confidence of a structured AI output.

    - evidence_strength: presence of evidence_source / quote_excerpt
    - source_credibility: known source_type present
    - cross_model_agreement: default 1.0 (updated externally if validated)
    - data_completeness: non-empty field ratio
    """
    if not isinstance(output, dict):
        return 0.0

    has_evidence = bool(
        output.get("evidence_source")
        or output.get("quote_excerpt")
        or output.get("source_url")
    )
    evidence_strength = 0.8 if has_evidence else 0.3

    source_type = output.get("source_type", "")
    credible_types = {"earnings", "press_release", "tender", "news"}
    source_credibility = 0.8 if source_type in credible_types else 0.5

    total = len(output)
    non_empty = sum(1 for v in output.values() if v not in (None, "", [], {}))
    data_completeness = non_empty / total if total > 0 else 0.0

    factors = ConfidenceFactors(
        evidence_strength=evidence_strength,
        source_credibility=source_credibility,
        cross_model_agreement=1.0,
        data_completeness=data_completeness,
    )
    return round(compute_confidence(factors), 4)


# ---------------------------------------------------------------------------
# Numeric Sanity Checks
# ---------------------------------------------------------------------------

_NUMERIC_GUARDS: list[tuple[str, float, str]] = [
    ("contract_value", 10_000_000_000.0, "ContractValue > £10bn anomaly"),
    ("capex_growth_pct", 500.0, "CapEx growth > 500% anomaly"),
]


def run_numeric_sanity_checks(data: dict[str, Any]) -> list[str]:
    """
    Run hard guardrail checks on known numeric fields.
    Returns a list of anomaly descriptions (empty if all OK).
    """
    anomalies: list[str] = []
    for field_name, threshold, message in _NUMERIC_GUARDS:
        value = data.get(field_name)
        if value is not None:
            try:
                if float(value) > threshold:
                    anomalies.append(f"{message} (value={value})")
            except (TypeError, ValueError):
                pass
    return anomalies


# ---------------------------------------------------------------------------
# Citation / Claim Verification
# ---------------------------------------------------------------------------


def verify_claim_in_text(claim_value: str, source_text: str) -> bool:
    """
    Check whether a claimed value (e.g. '€400m') appears in the source text.
    Returns True if the claim is supported, False otherwise.
    """
    pattern = re.escape(claim_value)
    return bool(re.search(pattern, source_text, re.IGNORECASE))


def build_source_attribution(
    signal: str,
    source_url: str,
    source_type: str,
    quote_excerpt: str,
    confidence_score: float,
) -> dict[str, Any]:
    """Build a standardised source attribution record."""
    import datetime

    return {
        "signal": signal,
        "source_url": source_url,
        "source_type": source_type,
        "retrieval_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "quote_excerpt": quote_excerpt,
        "confidence_score": confidence_score,
    }


# ---------------------------------------------------------------------------
# Human Review Gateway
# ---------------------------------------------------------------------------

_REVIEW_TRIGGERS: dict[str, str] = {
    "ma_detected": "M&A activity detected",
    "risk_allegation": "Risk allegation present",
    "executive_sensitivity": "Sensitive executive information flagged",
    "low_sample_pricing": "Pricing inference with low sample size",
    "large_expansion": "Expansion > £100m – dual-source confirmation required",
}

_MA_KEYWORDS = {"merger", "acquisition", "m&a", "takeover", "buyout"}
_RISK_KEYWORDS = {"allegation", "fraud", "investigation", "lawsuit", "scandal"}
_PRIVACY_KEYWORDS = {"private", "family", "personal", "home address"}


def needs_human_review(
    output: dict[str, Any], confidence: float, task_type: TaskType
) -> tuple[bool, list[str]]:
    """
    Determine whether an output requires human review.
    Returns (requires_review: bool, reasons: list[str]).
    """
    reasons: list[str] = []

    if confidence < REVIEW_THRESHOLD:
        reasons.append(
            f"Confidence {confidence:.2f} below threshold {REVIEW_THRESHOLD}"
        )

    text_blob = " ".join(str(v) for v in output.values()).lower()
    words = set(text_blob.split())

    if _MA_KEYWORDS & words:
        reasons.append(_REVIEW_TRIGGERS["ma_detected"])

    if _RISK_KEYWORDS & words:
        reasons.append(_REVIEW_TRIGGERS["risk_allegation"])

    if task_type == TaskType.EXECUTIVE_PROFILING and _PRIVACY_KEYWORDS & words:
        reasons.append(_REVIEW_TRIGGERS["executive_sensitivity"])

    if task_type == TaskType.PRICING_MODEL:
        try:
            if int(output.get("sample_size", 10)) < 5:
                reasons.append(_REVIEW_TRIGGERS["low_sample_pricing"])
        except (TypeError, ValueError):
            pass

    try:
        if float(output.get("expansion_value_gbp", 0) or 0) > 100_000_000:
            reasons.append(_REVIEW_TRIGGERS["large_expansion"])
    except (TypeError, ValueError):
        pass

    return bool(reasons), reasons


# ---------------------------------------------------------------------------
# Prompt Hashing (for audit trail)
# ---------------------------------------------------------------------------


def hash_prompt(system_prompt: str, user_content: str) -> str:
    """Return a truncated SHA-256 hash of the prompt for audit trail."""
    combined = f"{system_prompt}\n\n{user_content}"
    return hashlib.sha256(combined.encode()).hexdigest()[:16]


# ---------------------------------------------------------------------------
# Invocation Record
# ---------------------------------------------------------------------------


@dataclass
class AIInvocationRecord:
    prompt_hash: str
    model_version: str
    task_type: str
    temperature: float
    top_p: float
    input_tokens: int
    output_tokens: int
    confidence_score: float
    validation_outcome: str  # "pass" | "fallback_triggered" | "suppressed" | "human_review"
    timestamp: float = field(default_factory=time.time)
    needs_review: bool = False
    review_reasons: list[str] = field(default_factory=list)
    anomalies: list[str] = field(default_factory=list)


def create_invocation_record(
    prompt_hash: str,
    model_version: str,
    task_type: TaskType,
    temperature: float,
    top_p: float,
    input_tokens: int,
    output_tokens: int,
    confidence_score: float,
    validation_outcome: str,
    needs_review: bool = False,
    review_reasons: list[str] | None = None,
    anomalies: list[str] | None = None,
) -> AIInvocationRecord:
    return AIInvocationRecord(
        prompt_hash=prompt_hash,
        model_version=model_version,
        task_type=task_type.value,
        temperature=temperature,
        top_p=top_p,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        confidence_score=confidence_score,
        validation_outcome=validation_outcome,
        needs_review=needs_review,
        review_reasons=review_reasons or [],
        anomalies=anomalies or [],
    )
