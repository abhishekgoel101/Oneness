function deleteDiscussion(elem, post_id) {

    var parent = elem.closest('.discussion-post');

    $.confirm({
        draggable: false,
        title: 'Delete Discussion',
        content: 'Do you really want to delete this discussion ? ',
        buttons: {
            yes: {
                text: 'YES',
                btnClass: 'btn-green',
                action: function () {

                    $.ajax({
                        type: 'POST',
                        url: '/community/deletediscussion',
                        contentType: "application/json",
                        data: JSON.stringify({ post_id: post_id }),
                        success: function (response) {

                            $(parent).remove();

                        },
                        error: function (response) {
                            notie.alert({ type: 3, text: 'Something went wrong ', time: 2 })
                        }

                    });


                }

            },
            no: {
                text: 'NO',
                btnClass: 'btn-red',

            }

        }
    });


}

function toggleFeature(elem, post_id, community_id, featured) {

    var parent = elem.closest('.discussion-post');
    if (featured) {
        featured = false;
    }
    else {
        featured = true;
    }

    $.ajax({
        type: 'POST',
        url: '/community/changefeatured',
        contentType: "application/json",
        data: JSON.stringify({ post_id: post_id, featured: featured }),
        success: function (response) {

            //instead of this remove this div and append it at right place.
            document.location.href = "/community/discussion/" + community_id;

        },
        error: function (response) {
            notie.alert({ type: 3, text: 'Something went wrong ', time: 2 })
        }

    });


}

function toggleGlobal(elem, post_id, community_id, global) {

    var parent = elem.closest('.discussion-post');
    if (global) {
        global = false;
    }
    else {
        global = true;
    }

    $.ajax({
        type: 'POST',
        url: '/community/changeglobal',
        contentType: "application/json",
        data: JSON.stringify({ post_id: post_id, global: global }),
        success: function (response) {

            //instead of this append or remove global tag only.
            document.location.href = "/community/discussion/" + community_id;

        },
        error: function (response) {
            notie.alert({ type: 3, text: 'Something went wrong ', time: 2 })
        }

    });


}


function createDiscussionHtml(post, user_id, community_id, type) {

    try {
        var time1 = new Date();
        var time2 = new Date(post.dateCreated);
        var time = NumberOfDays(time1, time2);
        if (!(valid_time_reg.test(time))) {
            time2 = time2.toString();
            time = time2.substring(3, 15);
            time = 'on ' + time;
        } else {
            time = 'at ' + time;
        }

        var discussionOwner = user_id == post.postedBy._id;
        var myPowers;
        if (type == 'Owner' || type == 'Admin') { myPowers = true; }
        else {
            myPowers = false;
        }

        var dis_id = post._id;

        var title = post.title;

        var description = post.description;
        var UserProfilePic = $('.profilePic').attr('src');

        var code = '';
        featuredPresence = '';
        if (post.featured) {
            featuredPresence = 'featuredContainer';
        }
        code += '  <div class="container discussion-container discussion-post ' + featuredPresence + '" id="' + post._id + '">';
        code += '  <div class="panel panel-default allSidesSoft" style="background:white;" id="panel-default' + dis_id + '">';
        if (post.featured) {
            code += '<span class="badge featured-label" >Featured</span>';
            // f_flag = 0;
            // f_text = 'Unfeature';
        }

        if (post.global && myPowers) {
            code += '<span class="badge global-label" >Global</span>';
            //g_flag = 0;
            //g_text = 'Unpublish to oneness';
        }

        if (discussionOwner || myPowers) {
            code += '       <div class="dropup">';
            code += '         <a class="discussion-dropdown-menu" data-toggle="dropdown" style="float:right !important">';
            code += '           <i class="fa fa-ellipsis-h"></i>';
            code += '         </a>';
            code += '        <ul class="dropdown-menu dropdown-menu-right dropdown-menu-discussion">';
            code += '           <li><a class="request-dropdown-options" onclick="deleteDiscussion(this,\'' + post._id + '\')">Delete</a></li>';
            if (myPowers) {
                code += '           <li id="featuredBtnLi' + dis_id + '">';
                code += '               <a class="request-dropdown-options" onclick="toggleFeature(this,\'' + post._id + '\',\'' + community_id + '\',' + post.featured + ')" id="featuredBtn' + dis_id + '">';
                if (post.featured) {
                    code += 'Unfeature';
                }
                else {
                    code += 'Feature'
                }
                code += '</a>';
                code += '            </li>';
                code += '           <li id="globalBtnLi' + dis_id + '">';
                code += '               <a class="request-dropdown-options" onclick="toggleGlobal(this,\'' + post._id + '\',\'' + community_id + '\',' + post.global + ')" id="globalBtn' + dis_id + '">';

                if (post.global) {
                    code += 'Unpublish to Oneness';
                }
                else {
                    code += 'Publish to Oneness'
                }
                code += '</a>';
                code += '            </li>';
            }
            code += '         </ul>';
            code += '       </div>';
        }

        code += '  <div class="panel-body" style="padding:0;padding-top:10px">';
        code += '    <div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-title">';
        code += '       <a class="discussion-title" href="/community/discussion/' + community_id + '/selecteddiscussion/' + post._id + '" target="_blank">' + title + '</a>';
        code += '    </div>';
        code += '    <div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-head">';
        code += '      posted by <a href="/viewprofile/' + post.postedBy._id + '">' + post.postedBy.name + '</a> ' + time;
        code += '    </div>';
        code += '  </div>';

        /*--------Tag Maker---------*/
        try {
            if (post.tags.length) {
                code += '   <div class="panel-body" style="padding:0">';
                code += '     <div class="col-sm-12 col-xs-12 tagMainDiv" style="border-top: 1px solid white;padding:0">';
                code += '       <div class="col-sm-12">';
                for (var tagi = 0; tagi < post.tags.length; tagi++) {
                    code += '<span class="tag-still">' + post.tags[tagi] + '</span>';
                }
                code += '       </div>';
                code += '     </div>';
                code += '   </div>';
            }
        } catch (err) { code += ''; }
        /*--------------------------*/

        code += '  <div class="panel-body" style="padding:0;padding-top:10px;">';
        code += '    <div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-content" style="font-size:16px">';
        code += description;
        code += '    </div>';
        code += '  </div>';

        /*       
                if (response.externalUrl && response.externalUrl.length) {
                    code += '       <div class="col-sm-12">';
                    code += '          <div id="discussionLinkPreview' + dis_id + '"></div>';
                    code += '       </div>';
                }
                if (response.images.length) {
                    code += '       <div class="col-sm-12">';
                    code += '          <div class="discussionImageDiv" id="discussionImageDiv' + dis_id + '">';
                    for (var img = 0; img < response.images.length; img++) {
                        code += '<img src="/Upload/DiscussionImages/' + response.images[img] + '" class="allSides show-discussion-image">';
                    }
                    code += '          </div>';
                    code += '       </div>';
                }
            */

        code += '    <div class="panel-body" style="padding:0;padding-top:10px;">';
        code += '      <div class="col-sm-4 col-md-3 col-lg-2 col-xs-8">';
        code += '        <a class="comment-btn-discussion" onclick="showCommentsAction(this,\'' + post._id + '\',0)" id="showComments' + dis_id + '">';
        code += '          <i class="fa fa-comment-alt"></i> ' + post.commentsCount + ' <mobileNone>comments</mobileNone>';
        code += '        </a>';
        code += '<a class="show-comment-btn show-hide-comments comment-btn-discussion" onclick="hideCommentsAction(this,\'' + post._id + '\')" id="ShowHideComments' + dis_id + '">Hide</a>';
        code += '      </div>';
        code += '    </div>';
        code += '      <br />';
        code += '<ul class="panel-body all-comments-box" id="allCommentsContainer' + dis_id + '">';
        code += '</ul>';
        code += '      <div class="panel-body comment-panel" style="border:0;padding:0">';
        code += '          <div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 comment-box comment-compose-div-css" style="border-top: 1px solid #DFDFDF;" id="composeCommentDiv' + dis_id + '">';
        code += '              <div class="col-sm-1 col-md-1 col-xs-2"> <img src="' + UserProfilePic + '" class="discussion-comment-user"> </div>';
        code += '              <div class="col-sm-11 col-md-11 col-xs-10">';
        code += '                  <div class="input-group reply-input">';
        code += '                      <textarea type="text" autocomplete="off" class="form-control input-md comment-textarea" id="textarea' + dis_id + '" placeholder="comment to this discussion..." rows="1" maxlength="1500"></textarea>';
        code += '                      <span class="input-group-btn">';
        code += '                        <button class="btn btn-warning btn-md post-discussion-btn" onclick="postComment(this,\'' + dis_id + '\')">Post</button>';
        code += '                      </span>';
        code += '                    </div>';
        code += '              </div>';
        code += '          </div>';
        code += '      </div>';
        code += '    </div>';
        code += '    </div>';
    }
    catch (err) {
        code = '';
    }
    return code;
}


function initDiscussion(user_id, community_id, type) {

    $.ajax({
        type: 'POST',
        url: '/community/discussion/getdiscussions',
        contentType: "application/json",
        data: JSON.stringify({ community_id: community_id }),
        beforeSend: function () {
            $(".loading").css("display", "block");
        },

        success: function (posts) {

            $('#FeaturedParentDiv').empty();
            $('#DiscussionsList').empty();
            $(".loading").css("display", "none");

            var i = 0;
            var code = '';
            for (i = 0; i < posts.length; i++) {
                if (posts[i].featured == false) {
                    break;
                }

                code += createDiscussionHtml(posts[i], user_id, community_id, type);
            }
            $('#FeaturedParentDiv').append(code);

            code = '';

            for (; i < posts.length; i++) {

                code += createDiscussionHtml(posts[i], user_id, community_id, type);
            }

            $('#DiscussionsList').append(code);

        },

        error: function (jqxhr, err) {
            console.log(err);
            notie.alert({ type: 3, text: 'Something went wrong!', time: 2 });

            $(".loading").css("display", "none");

        }

    });


}

$(document).ready(function () {

    $('#discussionPostForm').submit(function (e) {
        e.preventDefault();

        var community_id = $('#community_id').val();
        var title = ($('#discussion-title').val()).trim();
        var description = $('#discussion-details').val();
        var tags = $('#tagEditor').val();
        var data = {};
        data.community_id = community_id;
        data.title = title;
        data.description = description;
        data.tags = tags;

        $.ajax({
            type: 'POST',
            url: '/community/postdiscussion',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {

                $('#discussion-title').val('');
                $('#discussion-details').val('');
                $("#tagEditor").val(null).trigger('change');


                //instead of this create div by js and append it.
                document.location.href = "/community/discussion/" + community_id;

                notie.alert({ type: 1, text: 'Discussion successfully posted', time: 2 });
            },
            error: function (response) {
                notie.alert({ type: 3, text: 'Unable to post Dsicussion', time: 2 })
            }

        });


    });


});