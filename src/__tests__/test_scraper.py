import pytest
from src.scrapers.free_scraper import scrape_all_free_sources

def test_scraper_success(monkeypatch):
    def mock_urlopen(url):
        class Response:
            def getcode(self): return 200
            def read(self): return b'<html><a data-click-id="body" href="/r/test">Test Job</a></html>'
            def __enter__(self): return self
            def __exit__(self, *args): pass
        return Response()
    monkeypatch.setattr("urllib.request.urlopen", mock_urlopen)
    jobs = scrape_all_free_sources()
    assert isinstance(jobs, list)
    assert any('Test Job' in j['title'] for j in jobs)

def test_scraper_empty(monkeypatch):
    def mock_urlopen(url):
        class Response:
            def getcode(self): return 200
            def read(self): return b''
            def __enter__(self): return self
            def __exit__(self, *args): pass
        return Response()
    monkeypatch.setattr("urllib.request.urlopen", mock_urlopen)
    jobs = scrape_all_free_sources()
    assert jobs == []

def test_scraper_http_error(monkeypatch):
    def mock_urlopen(url):
        raise Exception("404 Not Found")
    monkeypatch.setattr("urllib.request.urlopen", mock_urlopen)
    jobs = scrape_all_free_sources()
    assert jobs == []
