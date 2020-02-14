# @cesque/checkout

> a simple command line fuzzy-searching `git checkout` and `git merge` replacement

## Usage

Use `checkout` to interactively check out a branch, or `merge` to interactively
merge another branch into the current one. In the following example, you could 
just as easily use the merge command instead of checkout.

```bash
checkout test
```

opens an interactive picker:

```bash
checkout master
▶ test-branch
  some-test-branch
  feature/add-new-test-cases
  fix/testing-changes
```

then checks out the branch you select:

```bash
checking out branch: test-branch
Switched to branch 'test-branch'
```

---

You can also pass the `-f` argument to automatically choose the branch that
matches the input most closely, without opening the interactive picker. For example:

```bash
merge -f test
```

would output

```bash
merge -f test
merging branch: test
```

completing the merge automatically with no user input required.

---

If you want, you can use the base command `fuzz`, which performs a checkout
unless invoked with the flag `-m` which will perform a merge instead. Thus
`checkout [branch] -> fuzz [branch]` and `merge [branch] -> fuzz -m [branch]`.
You should most likely use the `checkout` and `merge` aliases over using
`fuzz`.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install -g @cesque/checkout
```
