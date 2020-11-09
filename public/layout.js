function changeLink(project) {
  console.log(project)
  if (project == 'Select a project') {
    $('#viewIssues').attr('href', '#');
    $('#projectName').text('');
  } else {
    $('#viewIssues').attr('href', '/' + project + '/');
    $('#projectName').text(project);
  }
  
}