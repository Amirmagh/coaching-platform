"""Question Flow engine.

Selects the next coaching question based on the GROW model (Goal, Reality,
Options, Will) and the current session stage. Question banks are provided
in Farsi. The engine tracks which stage a session is in and picks a
question that has not been asked yet in the current stage; it advances to
the next stage once its question bank is exhausted.
"""
from __future__ import annotations

import random
from dataclasses import dataclass
from enum import Enum


class GrowStage(Enum):
    GOAL = "goal"
    REALITY = "reality"
    OPTIONS = "options"
    WILL = "will"

    @property
    def next_stage(self):
        order = [GrowStage.GOAL, GrowStage.REALITY, GrowStage.OPTIONS, GrowStage.WILL]
        idx = order.index(self)
        return order[idx + 1] if idx + 1 < len(order) else None


QUESTION_BANK: dict = {
    GrowStage.GOAL: [
        "در این جلسه، دوست دارید روی چه موضوعی تمرکز کنیم؟",
        "اگر این جلسه کاملاً موفق باشد، چه چیزی متفاوت خواهد بود؟",
        "هدف شما از این گفتگو دقیقاً چیست؟",
        "وقتی به این هدف فکر می‌کنید، چه احساسی دارید؟",
    ],
    GrowStage.REALITY: [
        "الان دقیقاً در چه وضعیتی نسبت به این هدف هستید؟",
        "تا امروز چه اقداماتی در این مسیر انجام داده‌اید؟",
        "چه چیزهایی مانع پیشرفت شما شده‌اند؟",
        "چه کسانی یا چه منابعی در این مسیر به شما کمک کرده‌اند؟",
    ],
    GrowStage.OPTIONS: [
        "چه گزینه‌هایی برای رسیدن به این هدف پیش روی شماست؟",
        "اگر هیچ محدودیتی نداشتید، چه کاری انجام می‌دادید؟",
        "کدام یک از این گزینه‌ها برایتان جذاب‌تر است؟",
        "چه کسی می‌تواند در این مسیر به شما کمک کند؟",
    ],
    GrowStage.WILL: [
        "کدام قدم را می‌خواهید اول از همه بردارید؟",
        "چه زمانی این قدم را برمی‌دارید؟",
        "از ۱ تا ۱۰، چقدر به انجام این قدم متعهد هستید؟",
        "چه چیزی ممکن است مانع اجرای این تصمیم شود و چگونه با آن مواجه می‌شوید؟",
    ],
}


@dataclass
class QuestionFlowState:
    stage: GrowStage = GrowStage.GOAL
    asked_questions: frozenset = frozenset()

    def with_question_asked(self, question):
        return QuestionFlowState(
            stage=self.stage, asked_questions=self.asked_questions | {question}
        )

    def with_stage(self, stage):
        return QuestionFlowState(stage=stage, asked_questions=frozenset())


def next_question(state: QuestionFlowState):
    """Return ``(question, new_state)`` for the next question to ask.

    If every question in the current stage has already been asked, the flow
    automatically advances to the next GROW stage. When the ``WILL`` stage
    is exhausted, ``(None, state)`` is returned to signal the session is
    ready to conclude.
    """
    bank = QUESTION_BANK[state.stage]
    remaining = [q for q in bank if q not in state.asked_questions]

    if not remaining:
        next_stage = state.stage.next_stage
        if next_stage is None:
            return None, state
        state = state.with_stage(next_stage)
        bank = QUESTION_BANK[state.stage]
        remaining = [q for q in bank if q not in state.asked_questions]

    question = random.choice(remaining)
    return question, state.with_question_asked(question)
