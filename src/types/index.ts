/**
 * 型定義エントリポイント
 */
export type {
  ParameterDelta,
  DiagnosisParams,
  DiagnosisParamAxis,
  Choice,
  Scenario,
  Result,
  ScenarioLoadError,
} from './scenario';

export { DIAGNOSIS_PARAM_AXES, SCENARIO_LOAD_ERROR_TYPES } from './scenario';

export type {
  TypeAxis,
  OrderAxis,
  ActionAxis,
  ScopeAxis,
  TypeCode,
  PersonalityType,
  GamePhase,
  GameState,
  GameAction,
} from './game';

export { TYPE_AXIS_VALUES, GAME_PHASES } from './game';
