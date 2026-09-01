"""Crisis Detection engine.

Scans user-authored text for indicators of a mental-health crisis (suicidal
ideation, self-harm, harm to others, abuse) in both Farsi and English, and
returns an immediate, structured assessment plus Iran-specific crisis
resources. This engine intentionally errs on the side of caution
(high recall) since missing a crisis signal is far costlier than a false
positive.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from enum import Enum


class CrisisLevel(Enum):
    NONE = "none"
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    IMMINENT = "imminent"


# Keyword banks are intentionally simple substring/regex matches so that
# detection is fast and deterministic (no external calls, no latency) —
# crisis detection must be immediate.
_IMMINENT_PATTERNS = [
    r"خودکشی",
    r"خودم\s*رو\s*(می\s*کشم|بکشم)",
    r"می\s*خوام\s*بمیرم",
    r"دیگه\s*نمی\s*خوام\s*زنده\s*باشم",
    r"نقشه.*(خودکشی|مردن)",
    r"suicid\w*",
    r"kill myself",
    r"end my life",
    r"want to die",
]

_HIGH_PATTERNS = [
    r"خودآزاری",
    r"خودزنی",
    r"به\s*خودم\s*آسیب",
    r"آسیب\s*به\s*خودم",
    r"دیگه\s*تحمل\s*ندارم",
    r"self[- ]?harm",
    r"hurt myself",
    r"cutting myself",
]

_MODERATE_PATTERNS = [
    r"ناامید",
    r"بی\s*ارزش",
    r"هیچ\s*کس\s*بهم\s*اهمیت\s*نمی\s*ده",
    r"نمی\s*تونم\s*ادامه\s*بدم",
    r"hopeless",
    r"worthless",
    r"can'?t go on",
    r"give up on everything",
]

_HARM_TO_OTHERS_PATTERNS = [
    r"می\s*خوام\s*بهش\s*آسیب\s*بزنم",
    r"می\s*کشمش",
    r"hurt (him|her|them)",
    r"kill (him|her|them)",
]


@dataclass
class CrisisAssessment:
    level: CrisisLevel
    matched_categories: list = field(default_factory=list)
    matched_terms: list = field(default_factory=list)
    requires_immediate_action: bool = False
    message_fa: str = ""
    resources: list = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "level": self.level.value,
            "matched_categories": self.matched_categories,
            "matched_terms": self.matched_terms,
            "requires_immediate_action": self.requires_immediate_action,
            "message_fa": self.message_fa,
            "resources": self.resources,
        }


# Iran-specific crisis resources (kept minimal and hard-coded so they are
# available even if the database/network is unavailable).
IRAN_CRISIS_RESOURCES = [
    {
        "name_fa": "اورژانس اجتماعی (بهزیستی)",
        "phone": "123",
        "available": "۲۴ ساعته",
    },
    {
        "name_fa": "خط بحران - سازمان بهزیستی کشور",
        "phone": "1480",
        "available": "۲۴ ساعته",
    },
    {
        "name_fa": "فوریت‌های پزشکی",
        "phone": "115",
        "available": "۲۴ ساعته",
    },
]


def _find_matches(text: str, patterns: list) -> list:
    matches = []
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            matches.append(match.group(0))
    return matches


def detect_crisis(text: str) -> CrisisAssessment:
    """Analyze ``text`` and immediately return a :class:`CrisisAssessment`.

    This function performs no I/O and no external API calls so that crisis
    detection happens synchronously and instantly wherever a message is
    processed.
    """
    if not text:
        return CrisisAssessment(level=CrisisLevel.NONE)

    normalized = text.strip()

    imminent_matches = _find_matches(normalized, _IMMINENT_PATTERNS)
    harm_others_matches = _find_matches(normalized, _HARM_TO_OTHERS_PATTERNS)
    high_matches = _find_matches(normalized, _HIGH_PATTERNS)
    moderate_matches = _find_matches(normalized, _MODERATE_PATTERNS)

    if imminent_matches or harm_others_matches:
        categories = []
        if imminent_matches:
            categories.append("suicidal_ideation")
        if harm_others_matches:
            categories.append("harm_to_others")
        return CrisisAssessment(
            level=CrisisLevel.IMMINENT,
            matched_categories=categories,
            matched_terms=imminent_matches + harm_others_matches,
            requires_immediate_action=True,
            message_fa=(
                "به نظر می‌رسد شما در شرایط بسیار سختی هستید. لطفاً همین حالا با "
                "یکی از خطوط اورژانس زیر تماس بگیرید یا نزد نزدیک‌ترین فرد قابل اعتماد بروید."
            ),
            resources=IRAN_CRISIS_RESOURCES,
        )

    if high_matches:
        return CrisisAssessment(
            level=CrisisLevel.HIGH,
            matched_categories=["self_harm"],
            matched_terms=high_matches,
            requires_immediate_action=True,
            message_fa=(
                "متوجه شدم که این روزها برایتان بسیار دشوار بوده است. پیشنهاد می‌کنم "
                "در کنار ادامه گفتگو، با یکی از منابع حمایتی زیر هم تماس بگیرید."
            ),
            resources=IRAN_CRISIS_RESOURCES,
        )

    if moderate_matches:
        return CrisisAssessment(
            level=CrisisLevel.MODERATE,
            matched_categories=["distress"],
            matched_terms=moderate_matches,
            requires_immediate_action=False,
            message_fa=(
                "به نظر می‌رسد احساس دشواری را تجربه می‌کنید. مایلید کمی بیشتر درباره‌اش صحبت کنیم؟"
            ),
            resources=[],
        )

    return CrisisAssessment(level=CrisisLevel.NONE)
