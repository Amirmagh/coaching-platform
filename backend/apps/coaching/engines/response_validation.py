"""Response Validation engine.

Validates that a coach/assistant response stays within ICF-aligned coaching
boundaries: no advice-giving, no diagnosing/interpreting, no judgment, and
(ideally) ends with an open, powerful question that evokes the client's own
awareness rather than supplying an interpretation of the client's situation.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field

MIN_LENGTH = 10
MAX_LENGTH = 800

_ADVICE_PATTERNS = [
    r"\bباید\b",
    r"\bحتما\s*باید\b",
    r"پیشنهاد\s*می\s*کنم\s*(که\s*)?شما",
    r"بهتره\s*که",
    r"you should",
    r"you must",
    r"my advice is",
    r"i recommend that you",
]

_INTERPRETATION_PATTERNS = [
    r"این\s*یعنی\s*شما",
    r"مشکل\s*شما\s*این\s*است\s*که",
    r"به\s*نظر\s*من\s*شما\s*(دچار|مبتلا)",
    r"تشخیص\s*می\s*دهم",
    r"you have (a|an) .*(disorder|condition)",
    r"i diagnose",
    r"this means you are",
]

_JUDGMENT_PATTERNS = [
    r"اشتباه\s*کردی",
    r"این\s*کار\s*غلط\s*بود",
    r"that was wrong of you",
    r"you failed to",
]

_QUESTION_ENDING_RE = re.compile(r"[?؟]\s*$")


@dataclass
class ValidationResult:
    is_valid: bool
    violations: list = field(default_factory=list)
    warnings: list = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "is_valid": self.is_valid,
            "violations": self.violations,
            "warnings": self.warnings,
        }


def _matches_any(text: str, patterns: list) -> list:
    found = []
    for pattern in patterns:
        if re.search(pattern, text, flags=re.IGNORECASE):
            found.append(pattern)
    return found


def validate_response(text: str) -> ValidationResult:
    """Validate a coach/assistant response for ICF-aligned neutrality.

    Returns a :class:`ValidationResult` describing hard ``violations``
    (advice-giving, diagnosing/interpreting, judgment) that should block the
    response, and softer ``warnings`` (e.g. not ending with a question) that
    should be surfaced but do not necessarily invalidate the response.
    """
    violations: list = []
    warnings: list = []

    if text is None or not text.strip():
        return ValidationResult(is_valid=False, violations=["empty_response"])

    stripped = text.strip()

    if len(stripped) < MIN_LENGTH:
        violations.append("too_short")
    if len(stripped) > MAX_LENGTH:
        violations.append("too_long")

    if _matches_any(stripped, _ADVICE_PATTERNS):
        violations.append("gives_advice")
    if _matches_any(stripped, _INTERPRETATION_PATTERNS):
        violations.append("interprets_or_diagnoses")
    if _matches_any(stripped, _JUDGMENT_PATTERNS):
        violations.append("judgmental")

    if not _QUESTION_ENDING_RE.search(stripped):
        warnings.append("does_not_end_with_question")

    return ValidationResult(is_valid=len(violations) == 0, violations=violations, warnings=warnings)
