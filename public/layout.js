function changeLink(project) {
  console.log(project)
  if (project == 'Select a project') {
    $('#viewIssues').attr('href', '#');
    $('#projectName').text('');
    $('#viewIssues').attr('style', 'display: none;');
  } else {
    $('#viewIssues').attr('href', '/' + project + '/');
    $('#projectName').text('View all ' + project + ' issues');
    $('#viewIssues').attr('style', 'display: flex;');
  }
  
}