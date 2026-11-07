import importlib
import os
from unittest import mock

from django.test import TestCase


class SettingsEnvTests(TestCase):
    def _load_settings(self, **env):
        import config.settings as module

        with mock.patch.dict(os.environ, env, clear=False):
            return importlib.reload(module)

    def tearDown(self):
        # Restore the module to its environment-driven state.
        import config.settings as module

        importlib.reload(module)

    def test_defaults_unchanged(self):
        env = {k: v for k, v in os.environ.items() if k not in ('SQLITE_PATH', 'DJANGO_ALLOWED_HOSTS')}
        with mock.patch.dict(os.environ, env, clear=True):
            import config.settings as module

            loaded = importlib.reload(module)
        self.assertEqual(loaded.ALLOWED_HOSTS, ['localhost', '127.0.0.1'])
        self.assertEqual(loaded.DATABASES['default']['NAME'], loaded.BASE_DIR / 'db.sqlite3')

    def test_env_overrides(self):
        loaded = self._load_settings(DJANGO_ALLOWED_HOSTS='api, other', SQLITE_PATH='/data/db.sqlite3')
        self.assertEqual(loaded.ALLOWED_HOSTS, ['localhost', '127.0.0.1', 'api', 'other'])
        self.assertEqual(loaded.DATABASES['default']['NAME'], '/data/db.sqlite3')
