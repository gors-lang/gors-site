import { ChangeDetectionStrategy, Component, OnDestroy, computed, signal } from '@angular/core';

const repository = 'https://github.com/gors-lang/Gors';
const docsRoot = repository + '/blob/main/docs/';
const topics = [
  { title: 'First command-line program', summary: 'Read a file, pass arguments, and build an executable.', path: 'getting-started.md' },
  { title: 'Files and visibility', summary: 'Import local modules and expose declarations with pub.', path: 'language-v0.1.md#files-and-visibility' },
  { title: 'Types and expressions', summary: 'Work with structs, slices, strings, and methods.', path: 'language-v0.1.md#types-and-expressions' },
  { title: 'Control flow and variants', summary: 'Handle Option and Result with match and propagate errors with ?.', path: 'language-v0.1.md#control-flow-and-variants' },
  { title: 'Ownership and references', summary: 'Understand moves, shared borrowing, and mutable references.', path: 'language-v0.1.md#ownership-and-references' },
  { title: 'Compiler and bootstrap', summary: 'Follow the C23 pipeline and reproduce the compiler self-build.', path: 'compiler.md' },
].map(topic => ({ ...topic, url: docsRoot + topic.path }));

const examples = [
  {
    label: 'Borrowing',
    name: 'point.gors',
    output: '25',
    source: `struct Point {
    x: int,
    y: int,
}

fn (p: &Point) norm2() -> int {
    return p.x * p.x + p.y * p.y
}

fn main() {
    let p = Point { x: 3, y: 4 }
    println(p.norm2())
}`,
  },
  {
    label: 'Results',
    name: 'result.gors',
    output: 'empty input',
    source: `fn parse(input: string) -> Result<int, string> {
    if input == "" {
        return Err("empty input")
    }
    return Ok(1)
}

fn main() {
    match parse("") {
        Ok(value) => println(value),
        Err(message) => println(message),
    }
}`,
  },
  {
    label: 'Slices',
    name: 'slices.gors',
    output: '6',
    source: `fn main() {
    let numbers = [1, 2, 3]
    let mut sum = 0

    for value in numbers {
        sum = sum + value
    }

    println(sum)
}`,
  },
].map(example => ({
  ...example,
  download: 'data:text/plain;charset=utf-8,' + encodeURIComponent(example.source + '\n'),
  lines: example.source.split('\n').map(line => line.split(
    /("(?:[^"\\]|\\.)*"|\b(?:struct|fn|let|mut|return|if|match|for|in|int|string|Result|Ok|Err|println)\b|\b\d+\b)/,
  )),
}));

@Component({
  selector: 'app-root',
  templateUrl: './landing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing implements OnDestroy {
  protected readonly repository = repository;
  protected readonly release = repository + '/releases/tag/v1.0.0-alpha.4';
  protected readonly docs = docsRoot + 'README.md';
  protected readonly docsQuery = signal('');
  protected readonly matchingTopics = computed(() => {
    const query = this.docsQuery().trim().toLowerCase();
    const terms = query.split(/\s+/);
    return topics.filter(topic => {
      const text = (topic.title + ' ' + topic.summary).toLowerCase();
      return terms.every(term => text.includes(term));
    });
  });
  protected readonly examples = examples;
  protected readonly selected = signal(0);
  protected readonly copyStatus = signal('');
  private resetStatus?: ReturnType<typeof setTimeout>;

  protected readonly platforms = [
    { name: 'Linux', file: 'linux-amd64.tar.gz', command: './gors run examples/hello.gors --backend c' },
    { name: 'Windows', file: 'windows-amd64.zip', command: '.\\gors.exe run examples/hello.gors --backend c' },
  ];
  protected readonly platformIndex = signal(0);

  protected async copy(text: string, target: string) {
    clearTimeout(this.resetStatus);
    try {
      await navigator.clipboard.writeText(text);
      this.copyStatus.set(target);
    } catch {
      this.copyStatus.set('Could not copy. Select and copy the text manually.');
    }
    this.resetStatus = setTimeout(() => this.copyStatus.set(''), 2400);
  }

  ngOnDestroy() {
    clearTimeout(this.resetStatus);
  }
}
