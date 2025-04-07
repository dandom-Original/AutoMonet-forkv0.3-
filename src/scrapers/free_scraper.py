import urllib.request
from html.parser import HTMLParser

SOURCES = [
  {"url": "https://www.reddit.com/r/forhire/new/", "parser": "reddit"},
  {"url": "https://www.indeed.com/jobs?q=remote&fromage=1", "parser": "indeed"}
]

class RedditLinkParser(HTMLParser):
  def __init__(self):
    super().__init__()
    self.links = []
    self.current_link = None
    self.collect_data = False
    self.current_data = []

  def handle_starttag(self, tag, attrs):
    if tag == "a":
      attr_dict = dict(attrs)
      if attr_dict.get("data-click-id") == "body":
        self.collect_data = True
        self.current_link = attr_dict.get("href", "")

  def handle_data(self, data):
    if self.collect_data:
      self.current_data.append(data)

  def handle_endtag(self, tag):
    if tag == "a" and self.collect_data:
      text = "".join(self.current_data).strip()
      self.links.append({"title": text, "url": self.current_link})
      self.collect_data = False
      self.current_data = []
      self.current_link = None

class IndeedLinkParser(HTMLParser):
  def __init__(self):
    super().__init__()
    self.links = []
    self.current_link = None
    self.collect_data = False
    self.current_data = []

  def handle_starttag(self, tag, attrs):
    if tag == "a":
      attr_dict = dict(attrs)
      if "class" in attr_dict and "jcs-JobTitle" in attr_dict["class"]:
        self.collect_data = True
        self.current_link = attr_dict.get("href", "")

  def handle_data(self, data):
    if self.collect_data:
      self.current_data.append(data)

  def handle_endtag(self, tag):
    if tag == "a" and self.collect_data:
      text = "".join(self.current_data).strip()
      # Ergänze die indeed-URL als Prefix
      self.links.append({"title": text, "url": "https://indeed.com" + self.current_link})
      self.collect_data = False
      self.current_data = []
      self.current_link = None

def parse_jobs(html, parser_type):
  if parser_type == "reddit":
    parser = RedditLinkParser()
    parser.feed(html)
    return parser.links
  elif parser_type == "indeed":
    parser = IndeedLinkParser()
    parser.feed(html)
    return parser.links
  return []

def scrape_all_free_sources():
  jobs = []
  for source in SOURCES:
    try:
      with urllib.request.urlopen(source["url"]) as response:
        if response.getcode() == 200:
          html = response.read().decode('utf-8')
          jobs.extend(parse_jobs(html, source["parser"]))
    except Exception as e:
      print(f"Fehler bei {source['url']}: {e}")
  return jobs
