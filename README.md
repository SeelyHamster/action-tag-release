# action-tag-release
Github action for auto release

Created format is `${prefix}.${year}.${weekNumber}.${version}` or with prefix `${prefix}.${year}.${weekNumber}.${version}`
Example:
```
APP_NAME.22.22.0
22.22.0
```

We only get 2 last digit of the year and `${version}` will increase by 1 for each push to `target_branch`.

# Parameter

| Parameter  | Description | Required | Default |
| ------------- | ------------- | ------------- | ------------- | 
| target_branch  | Release and tag target branch  | false | master
| prefix  | Prefix used for release and tag  | false | -
| github_token | Github secret token | yes | -

# Example

```
name: Automatic Tag And Release
on:
  push:
    branches:
      - "main"

jobs:
  tag_release_job:
    runs-on: ubuntu-latest
    steps:
      - name: Create new tag and release
        id: create_tag_and_release
        uses: SeelyHamster/action-tag-release@v0.1.0
        with:
          target_branch: 'main'
          github_token: ${{ secrets.PRIVATE_REPO_TOKEN }}
```