"""ICF Core Competencies engine.

Encapsulates the 8 ICF (International Coaching Federation) Core
Competencies used to structure and evaluate coaching conversations:

    A. Foundation
        1. Demonstrates Ethical Practice
        2. Embodies a Coaching Mindset
    B. Co-Creating the Relationship
        3. Establishes and Maintains Agreements
        4. Cultivates Trust and Safety
        5. Maintains Presence
    C. Communicating Effectively
        6. Listens Actively
        7. Evokes Awareness
    D. Cultivating Learning and Growth
        8. Facilitates Client Growth

This module does not "coach" on its own; it provides structured metadata
and lightweight heuristics that the other engines (question flow, response
validation) use to keep the conversation ICF-aligned.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class Competency(Enum):
    ETHICAL_PRACTICE = "ethical_practice"
    COACHING_MINDSET = "coaching_mindset"
    AGREEMENTS = "agreements"
    TRUST_AND_SAFETY = "trust_and_safety"
    PRESENCE = "presence"
    ACTIVE_LISTENING = "active_listening"
    EVOKES_AWARENESS = "evokes_awareness"
    FACILITATES_GROWTH = "facilitates_growth"


@dataclass(frozen=True)
class CompetencyDefinition:
    key: Competency
    number: int
    name_en: str
    name_fa: str
    description_fa: str
    keywords_fa: tuple = field(default_factory=tuple)


ICF_CORE_COMPETENCIES: dict[Competency, CompetencyDefinition] = {
    Competency.ETHICAL_PRACTICE: CompetencyDefinition(
        key=Competency.ETHICAL_PRACTICE,
        number=1,
        name_en="Demonstrates Ethical Practice",
        name_fa="رعایت اخلاق حرفه‌ای",
        description_fa="درک و اجرای مداوم اخلاق کوچینگ و استانداردهای حرفه‌ای.",
        keywords_fa=("محرمانه", "حریم خصوصی", "رضایت"),
    ),
    Competency.COACHING_MINDSET: CompetencyDefinition(
        key=Competency.COACHING_MINDSET,
        number=2,
        name_en="Embodies a Coaching Mindset",
        name_fa="داشتن ذهنیت کوچینگ",
        description_fa="ذهنیتی باز، کنجکاو، منعطف و مراجع-محور.",
    ),
    Competency.AGREEMENTS: CompetencyDefinition(
        key=Competency.AGREEMENTS,
        number=3,
        name_en="Establishes and Maintains Agreements",
        name_fa="ایجاد و حفظ توافقات",
        description_fa="همکاری با مراجع برای ایجاد توافقات روشن درباره جلسه و رابطه کوچینگ.",
    ),
    Competency.TRUST_AND_SAFETY: CompetencyDefinition(
        key=Competency.TRUST_AND_SAFETY,
        number=4,
        name_en="Cultivates Trust and Safety",
        name_fa="ایجاد اعتماد و امنیت روانی",
        description_fa="ایجاد فضایی امن که به مراجع اجازه اشتراک‌گذاری آزادانه می‌دهد.",
    ),
    Competency.PRESENCE: CompetencyDefinition(
        key=Competency.PRESENCE,
        number=5,
        name_en="Maintains Presence",
        name_fa="حضور کامل در لحظه",
        description_fa="حضور کامل با مراجع با رویکردی باز، منعطف و مطمئن.",
    ),
    Competency.ACTIVE_LISTENING: CompetencyDefinition(
        key=Competency.ACTIVE_LISTENING,
        number=6,
        name_en="Listens Actively",
        name_fa="گوش دادن فعال",
        description_fa="تمرکز بر آنچه مراجع می‌گوید و نمی‌گوید تا معنای کامل درک شود.",
    ),
    Competency.EVOKES_AWARENESS: CompetencyDefinition(
        key=Competency.EVOKES_AWARENESS,
        number=7,
        name_en="Evokes Awareness",
        name_fa="برانگیختن آگاهی",
        description_fa="تسهیل بینش و یادگیری مراجع از طریق پرسش‌های قدرتمند، سکوت و تأمل.",
    ),
    Competency.FACILITATES_GROWTH: CompetencyDefinition(
        key=Competency.FACILITATES_GROWTH,
        number=8,
        name_en="Facilitates Client Growth",
        name_fa="تسهیل رشد مراجع",
        description_fa="همکاری با مراجع برای تبدیل یادگیری و بینش به اقدام.",
    ),
}


def list_competencies() -> list[CompetencyDefinition]:
    """Return all 8 ICF core competencies ordered by their official number."""
    return sorted(ICF_CORE_COMPETENCIES.values(), key=lambda c: c.number)


def get_competency(key: Competency) -> CompetencyDefinition:
    return ICF_CORE_COMPETENCIES[key]
