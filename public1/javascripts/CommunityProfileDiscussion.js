function createProfileDiscussionHtml(post, community_id) {

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

        var dis_id = post._id;

        var title = post.title;

        var description = post.description;

        var code = '';
        featuredPresence = '';
        if (post.featured) {
            featuredPresence = 'featuredContainer';
        }

        code += '  <div class="container discussion-container discussion-post " id="' + post._id + '" style="width:100%;padding:0" >';
        code += '  <div class="panel panel-default discussion-body-main allSides " >';

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


function initProfileDiscussion(community_id) {

    $.ajax({
        type: 'POST',
        url: '/community/communityprofile/getglobaldiscussions',
        contentType: "application/json",
        data: JSON.stringify({ community_id: community_id }),
        beforeSend: function () {
            $(".loading").css("display", "block");
        },

        success: function (posts) {

            $('#GlobalInProfile').empty();
            $(".loading").css("display", "none");

            var code = '';
            for (var i = 0; i < posts.length; i++) {

                code += createProfileDiscussionHtml(posts[i], community_id);
            }
            $('#GlobalInProfile').append(code);


        },

        error: function (jqxhr, err) {
            console.log(err);
            notie.alert({ type: 3, text: 'Something went wrong!', time: 2 });

            $(".loading").css("display", "none");

        }

    });


}

