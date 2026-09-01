from django.test import TestCase

from apps.coaching.engines.competencies import Competency, list_competencies
from apps.coaching.engines.crisis_detection import CrisisLevel, detect_crisis
from apps.coaching.engines.question_flow import (
    GrowStage,
    QUESTION_BANK,
    QuestionFlowState,
    next_question,
)
from apps.coaching.engines.response_validation import validate_response


class CompetenciesEngineTests(TestCase):
    def test_lists_all_eight_icf_competencies(self):
        competencies = list_competencies()
        self.assertEqual(len(competencies), 8)
        self.assertEqual([c.number for c in competencies], list(range(1, 9)))

    def test_competency_enum_matches_definitions(self):
        competencies = list_competencies()
        keys = {c.key for c in competencies}
        self.assertEqual(keys, set(Competency))


class CrisisDetectionEngineTests(TestCase):
    def test_no_crisis_for_neutral_message(self):
        result = detect_crisis("امروز روز خوبی بود و به هدفم نزدیک‌تر شدم.")
        self.assertEqual(result.level, CrisisLevel.NONE)
        self.assertFalse(result.requires_immediate_action)

    def test_detects_imminent_suicidal_ideation_in_farsi(self):
        result = detect_crisis("دیگه نمی خوام زنده باشم و به خودکشی فکر می کنم")
        self.assertEqual(result.level, CrisisLevel.IMMINENT)
        self.assertTrue(result.requires_immediate_action)
        self.assertTrue(result.resources)

    def test_detects_imminent_suicidal_ideation_in_english(self):
        result = detect_crisis("I want to kill myself tonight")
        self.assertEqual(result.level, CrisisLevel.IMMINENT)
        self.assertTrue(result.requires_immediate_action)

    def test_detects_self_harm_high_level(self):
        result = detect_crisis("گاهی به خودم آسیب می زنم")
        self.assertEqual(result.level, CrisisLevel.HIGH)
        self.assertTrue(result.requires_immediate_action)

    def test_detects_moderate_distress(self):
        result = detect_crisis("خیلی احساس ناامیدی می کنم این روزها")
        self.assertEqual(result.level, CrisisLevel.MODERATE)
        self.assertFalse(result.requires_immediate_action)

    def test_empty_text_returns_none_level(self):
        result = detect_crisis("")
        self.assertEqual(result.level, CrisisLevel.NONE)


class ResponseValidationEngineTests(TestCase):
    def test_valid_open_question_passes(self):
        result = validate_response("وقتی به این هدف فکر می کنید، چه احساسی دارید؟")
        self.assertTrue(result.is_valid)
        self.assertEqual(result.violations, [])

    def test_rejects_advice_giving(self):
        result = validate_response("شما باید همین امروز این تصمیم رو بگیرید و ادامه بدید فردا")
        self.assertFalse(result.is_valid)
        self.assertIn("gives_advice", result.violations)

    def test_rejects_interpretation(self):
        result = validate_response("مشکل شما این است که اعتماد به نفس ندارید و باید کاری کنید")
        self.assertFalse(result.is_valid)
        self.assertIn("interprets_or_diagnoses", result.violations)

    def test_rejects_empty_response(self):
        result = validate_response("")
        self.assertFalse(result.is_valid)
        self.assertIn("empty_response", result.violations)

    def test_warns_when_not_ending_with_question(self):
        result = validate_response("این موضوع جالبی است که به آن اشاره کردید.")
        self.assertIn("does_not_end_with_question", result.warnings)


class QuestionFlowEngineTests(TestCase):
    def test_starts_at_goal_stage(self):
        state = QuestionFlowState()
        self.assertEqual(state.stage, GrowStage.GOAL)

    def test_advances_through_all_stages(self):
        state = QuestionFlowState()
        seen_stages = {state.stage}
        question = "start"
        while question is not None:
            question, state = next_question(state)
            if question is not None:
                seen_stages.add(state.stage)
        self.assertEqual(
            seen_stages, {GrowStage.GOAL, GrowStage.REALITY, GrowStage.OPTIONS, GrowStage.WILL}
        )

    def test_does_not_repeat_questions_within_a_stage(self):
        state = QuestionFlowState()
        asked = set()
        for _ in range(len(QUESTION_BANK[GrowStage.GOAL])):
            question, state = next_question(state)
            self.assertNotIn(question, asked)
            asked.add(question)

    def test_returns_none_after_will_stage_exhausted(self):
        state = QuestionFlowState(stage=GrowStage.WILL)
        for q in QUESTION_BANK[GrowStage.WILL]:
            _, state = next_question(state)
        question, _ = next_question(state)
        self.assertIsNone(question)
