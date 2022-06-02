const week = require("weeknumber");
const core = require("@actions/core");
const github = require("@actions/github");

async function main() {
  try {
    const time = new Date().toTimeString();
    core.setOutput("time", time);

    const { owner, repo } = github.context.repo;
    const target_branch = core.getInput("target_branch");

    const prefix = core.getInput("prefix") || "";
    const currentYear = new Date().getFullYear()%100;
    const currentWeekNumber = week.weekNumber(new Date());
    var newReleaseVersion = 0;

    var newTag = `${prefix}${currentYear}.${currentWeekNumber}.${newReleaseVersion}`;

    var octokit = github.getOctokit(core.getInput("github_token"));

    try {
      await octokit
        .request("GET /repos/{owner}/{repo}/releases/latest", {
          owner: owner,
          repo: repo,
        })
        .then(function (response) {
          var tag_name = response.data.tag_name;
          if (prefix != "") {
            tag_name = tag_name.replace(prefix + ".", "");
          }

          var [yearVersion, weekVersion, releaseVersion] = tag_name.split('.');
          
          if ( yearVersion == currentYear && weekVersion == currentWeekNumber ) {
            newReleaseVersion = parseInt(releaseVersion) + 1;
          }

          newTag = `${currentYear}.${currentWeekNumber}.${newReleaseVersion}`;
          if (prefix != "") {
            newTag = `${prefix}.${newTag}`;
            }
        });
    } catch (error) {
      core.info(`Fail to get latest release: ${error.message}`);
    }

    core.info(`Current Year: ${currentYear} and Current Week: ${currentWeekNumber}`);
    core.info(`New Tag is ${newTag}`);
    core.setOutput("automatic_tag", newTag);

    try {
        await octokit.request('POST /repos/{owner}/{repo}/releases', {
            owner: owner,
            repo: repo,
            tag_name: newTag,
            target_commitish: target_branch,
            name: newTag,
            draft: false,
            prerelease: false,
            generate_release_notes: true
          })
          .then(function (response) {
            var tag_name = response.data.tag_name;
            if (prefix != "") {
              tag_name = tag_name.replace(prefix + ".", "");
            }
  
            var [yearVersion, weekVersion, releaseVersion] = tag_name.split('.');
            
            if ( yearVersion == currentYear && weekVersion == currentWeekNumber ) {
              newReleaseVersion = parseInt(releaseVersion) + 1;
            }
  
            newTag = `${prefix}${currentYear}.${currentWeekNumber}.${newReleaseVersion}`;
          });
      } catch (error) {
        core.info(`Fail to create release: ${error.message}`);
      }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();