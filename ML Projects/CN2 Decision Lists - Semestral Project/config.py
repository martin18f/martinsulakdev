from pathlib import Path

# Koreň projektu.
BASE_DIR = Path(__file__).resolve().parent

# Priečinky projektu.
DATASETS_DIR = BASE_DIR / "datasets"
OUTPUTS_DIR = BASE_DIR / "outputs"
RULES_DIR = OUTPUTS_DIR / "rules"
METRICS_DIR = OUTPUTS_DIR / "metrics"
TABLES_DIR = OUTPUTS_DIR / "tables"
PLOTS_DIR = OUTPUTS_DIR / "plots"

# Predvolené nastavenia experimentu.
DEFAULT_DATASET_PATH = DATASETS_DIR / "student_performance_clean.csv"
DEFAULT_TARGET_COLUMN = "vykon"
DEFAULT_TEST_SIZE = 0.2
DEFAULT_RANDOM_STATE = 42
DEFAULT_BEAM_WIDTH = 5
DEFAULT_MIN_COVERAGE = 2
DEFAULT_MAX_RULE_LENGTH = 4
DEFAULT_ENABLE_PLOTS = True