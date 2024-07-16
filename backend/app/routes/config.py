from argon2 import PasswordHasher

ARGON2_TIME_COST = 5
ARGON2_MEMORY_COST = 102400
ARGON2_PARALLELISM = 8

ph = PasswordHasher(
    time_cost=ARGON2_TIME_COST,
    memory_cost=ARGON2_MEMORY_COST,
    parallelism=ARGON2_PARALLELISM
)