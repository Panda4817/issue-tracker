$(document).ready(function () {
  var currentProject = window.location.pathname.replace(/[\/]/g, "");
  currentProject = currentProject.replace(/%20/g, " ");
  var url = "/api/issues/"+currentProject + window.location.search;
  $('#projectTitle').text('All issues for: '+currentProject)
  $('.project-post').val(currentProject);
  $.ajax({
    type: "GET",
    url: url,
    success: function(data)
    {
      console.log(data)
      
      if (data.length == 0) {
        $('#issueDisplay').html('<div class="col">No results, check your query filtering string</div>');
        return;
      }
      var issues= [];
      data.forEach(function(ele) {
        var openstatus;
        (ele.open) ? openstatus = 'open' : openstatus = 'closed';
        var single = [
          '<div class="issue '+openstatus+' col-md-5 m-1 card">',
          '<p class="id">id: '+ele._id+'</p>',
          '<h3>'+ele.issue_title+' -  ('+openstatus+')</h3>',
          '<p>'+ele.issue_text+'</p>',
          '<p>'+ele.status_text+'</p>',
          '<p class="id"><b>Created by:</b> '+ele.created_by+'  <b>Assigned to:</b> '+ele.assigned_to+'</p>',
          '<p class="id"><b>Created on:</b> '+new Date(ele.created_on).toLocaleString()+'  <b>Last updated:</b> '+new Date(ele.updated_on).toLocaleString()+'</p>',
          '<div class="row justify-content-around">',
          (ele.open) ? '<button class="btn btn-success closeIssue col-5" id="'+ele._id+'">close?</button>' : '<button class="btn btn-warning openIssue col-5" id="'+ele._id+'">open?</button>',
          '<button class="deleteIssue btn btn-danger col-5" id="'+ele._id+'">delete?</button>',
          '</div></div>'
          
        ];
        issues.push(single.join(''));
      });
      $('#issueDisplay').html(issues.join(''));
    }
  });
  
  $('#newIssue').submit(function(e){
    $(this).attr('action', "/api/issues/" + currentProject);
    $.ajax({
      type: "POST",
      url: url,
      data: $(this).serialize(),
      success: function(data) { 
        window.location.reload(true);
        
      }
    });
    e.preventDefault();
  });
  
  $('#issueDisplay').on('click','.closeIssue', function(e) {
    var url = "/api/issues/"+currentProject;
    $.ajax({
      type: "PUT",
      url: url,
      data: {_id: $(this).attr('id'), open: false},
      success: function(data) { alert(JSON.stringify(data)); window.location.reload(true); }
    });
    e.preventDefault();
  });

  $('#issueDisplay').on('click','.openIssue', function(e) {
    var url = "/api/issues/"+currentProject;
    $.ajax({
      type: "PUT",
      url: url,
      data: {_id: $(this).attr('id'), open: true},
      success: function(data) { alert(JSON.stringify(data)); window.location.reload(true); }
    });
    e.preventDefault();
  });

  $('#issueDisplay').on('click','.deleteIssue', function(e) {
    var url = "/api/issues/"+currentProject;
    $.ajax({
      type: "DELETE",
      url: url,
      data: {_id: $(this).attr('id')},
      success: function(data) { alert(JSON.stringify(data)); window.location.reload(true); }
    });
    e.preventDefault();
  });
})