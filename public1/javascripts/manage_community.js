
$('.manageCommunity-child-btn').click(function (e) {
    $(".manageCommunity-child-btn").removeClass("manageCommunity-btn-active");
    $(e.target).addClass("manageCommunity-btn-active");
});


function updateManageCommunityBtns(countAll) {

    $('#UsersShowBtn').text(countAll.users);
    $('#AdminsShowBtn').text(countAll.admins);
    $('#InvitedUserShowBtn').text(countAll.invites);

    if (countAll.requests) {
        $('#RequestsShowBtn').text(countAll.requests);

    }

}

function UsersList(type, community_id) {

    $.ajax({
        type: 'POST',
        url: '/community/managecommunity/getdetails',
        contentType: "application/json",
        data: JSON.stringify({ community_id: community_id, detailsOf: "members" }),
        success: function (data) {

            var code = createUsers(data, type, community_id);

            $('#comlist').empty();
            $('#comlist').append(code);
            updateManageCommunityBtns(data.countAll);

        },
        error: function (jqxhr, err) {
            console.log(err);
            notie.alert({ type: 3, text: 'Something went wrong!', time: 2 });
        }

    });


}

function AdminsList(type, community_id) {

    $.ajax({
        type: 'POST',
        url: '/community/managecommunity/getdetails',
        contentType: "application/json",
        data: JSON.stringify({ community_id: community_id, detailsOf: "owner admins" }),
        success: function (data) {

            var code = createAdmins(data, type, community_id);
            $('#comlist').empty();
            $('#comlist').append(code);
            updateManageCommunityBtns(data.countAll);
        },
        error: function (jqxhr, err) {
            console.log(err);
            notie.alert({ type: 3, text: 'Something went wrong!', time: 2 });
        }

    });


}

function RequestsList(type, community_id) {

    $.ajax({
        type: 'POST',
        url: '/community/managecommunity/getdetails',
        contentType: "application/json",
        data: JSON.stringify({ community_id: community_id, detailsOf: "requests" }),
        success: function (data) {

            var code = createRequests(data, type, community_id);
            $('#comlist').empty();
            $('#comlist').append(code);
            updateManageCommunityBtns(data.countAll);
        },
        error: function (jqxhr, err) {
            console.log(err);
            notie.alert({ type: 3, text: 'Something went wrong!', time: 2 });
        }

    });


}

function InvitedUsersList(type, community_id) {

    $.ajax({
        type: 'POST',
        url: '/community/managecommunity/getdetails',
        contentType: "application/json",
        data: JSON.stringify({ community_id: community_id, detailsOf: "invitedUsers" }),
        success: function (data) {

            var code = createInvitedUsers(data, type, community_id);
            $('#comlist').empty();
            $('#comlist').append(code);
            updateManageCommunityBtns(data.countAll);
        },
        error: function (jqxhr, err) {
            console.log(err);
            notie.alert({ type: 3, text: 'Something went wrong!', time: 2 });
        }

    });


}


function createUsers(data, type, community_id) {

    var str = "";
    if (data.members.length) {
        for (var i = 0; i < data.members.length; i++) {

            str += "<div class='col-sm-12 col-xs-12 allcoms community-user-div' style='margin-top:5px;'>";
            str += "<div class='col-sm-2 col-xs-3' style='padding:5px;'>";
            str += "<a href='/viewprofile/" + data.members[i]._id + "'><img src='" + data.members[i].image + "' class='community-member-pic'>";
            str += "</a></div>";
            str += "<div class='col-sm-8 col-xs-6 scrollable'>";
            str += "<a class='comusername' href='/viewprofile/" + data.members[i]._id + "'>" + data.members[i].name + "</a>";
            str += "</div>";
            str += "<div class='col-sm-2 col-xs-3'>";

            if (type == "Owner") {
                str += "<a class='community-user-short-btn' onclick='promoteUser(this,\"" + data.members[i]._id + "\",\"" + community_id + "\")' style='float:left'>"
                str += "<i class='fa fa-chevron-up'></i>";
                str += "</a>";
            }

            str += "<a class='community-user-short-btn' style='float:right' onclick='removeUser(this,\"" + data.members[i]._id + "\",\"" + community_id + "\")'>";
            str += "<i class='fa fa-times'></i></a>";

            str += "</div>";
            str += "</div>";
        }
    }
    else {

        str = "<div class='col-sm-12 allcoms well well-sm' style='margin-top:5px;font-weight:bold'><center>No Users</center></div>";

    }

    return str;
}


function createAdmins(data, type, community_id) {
    var str = "";

    //For Owner    
    str += "<div class='col-sm-12 col-xs-12 allcoms community-user-div' style='margin-top:5px;'>";
    str += "<div class='col-sm-2 col-xs-3' style='padding:5px;'>";
    str += "<a href='/viewprofile/" + data.owner._id + "'><img src='" + data.owner.image + "' class='community-member-pic'>";
    str += "</a></div>";
    str += "<div class='col-sm-8 col-xs-6 scrollable'>";
    str += "<a class='comusername' href='/viewprofile/" + data.owner._id + "'>" + data.owner.name + "</a>";
    str += "</div>";
    str += "<div class='col-sm-2 col-xs-3'>";

    str += "<span class='label label-success' style='margin-top:25px;float:right'>Owner</span>";

    str += "</div>";
    str += "</div>";

    //For Admins

    for (var i = 0; i < data.admins.length; i++) {

        str += "<div class='col-sm-12 col-xs-12 allcoms community-user-div' style='margin-top:5px;'>";
        str += "<div class='col-sm-2 col-xs-3' style='padding:5px;'>";
        str += "<a href='/viewprofile/" + data.admins[i]._id + "'><img src='" + data.admins[i].image + "' class='community-member-pic'>";
        str += "</a></div>";
        str += "<div class='col-sm-8 col-xs-6 scrollable'>";
        str += "<a class='comusername' href='/viewprofile/" + data.admins[i]._id + "'>" + data.admins[i].name + "</a>";
        str += "</div>";
        str += "<div class='col-sm-2 col-xs-3'>";

        if (type == "Owner") {

            str += "<a class='community-user-short-btn' onclick='demoteUser(this,\"" + data.admins[i]._id + "\",\"" + community_id + "\")' style='float:left'>"
            str += "<i class='fa fa-chevron-down'></i>";
            str += "</a>";


            str += "<a class='community-user-short-btn' style='float:right' onclick='removeUser(this,\"" + data.admins[i]._id + "\",\"" + community_id + "\")'>";
            str += "<i class='fa fa-times'></i></a>";

        }
        else {
            str += "<span class='label label-warning' style='margin-top:25px;float:right'>Admin</span>";

        }

        str += "</div>";
        str += "</div>";



    }


    return str;
}

function createRequests(data, type, community_id) {

    var str = "";

    if (data.requests.length) {

        for (var i = 0; i < data.requests.length; i++) {

            str += "<div class='col-sm-12 col-xs-12 allcoms community-user-div' style='margin-top:5px;'>";
            str += "<div class='col-sm-2 col-xs-3' style='padding:5px;'>";
            str += "<a href='/viewprofile/" + data.requests[i]._id + "'><img src='" + data.requests[i].image + "' class='community-member-pic'>";
            str += "</a></div>";
            str += "<div class='col-sm-8 col-xs-6 scrollable'>";
            str += "<a class='comusername' href='/viewprofile/" + data.requests[i]._id + "'>" + data.requests[i].name + "</a>";
            str += "</div>";
            str += "<div class='col-sm-2 col-xs-3'>";

            str += "<div class='dropdown'>";
            str += "<div class='dropup request-btn-dropdown'><button class='btn btn-default dropdown-toggle' type='button' data-toggle='dropdown' style='float:right !important'>Option";
            str += "</button>";
            str += " <ul class='dropdown-menu dropdown-menu-right'>";
            str += "<li><a class='request-dropdown-options' onclick='acceptRequest(this,\"" + data.requests[i]._id + "\",\"" + community_id + "\")'>";
            str += "Accept</a></li>";
            str += "<li><a class='request-dropdown-options' onclick='cancelRequest(this,\"" + data.requests[i]._id + "\",\"" + community_id + "\")'>";
            str += "Reject</a></li>";

            str += "</ul>";
            str += "</div></div>";


            str += "</div>";
            str += "</div>";


        }

    }
    else {
        str = "<div class='col-sm-12 allcoms well well-sm' style='margin-top:5px;font-weight:bold'><center>There are no Requests</center></div>";
    }

    return str;


}

function createInvitedUsers(data, type, community_id) {

    var str = "";

    if (data.invitedUsers.length) {

        for (var i = 0; i < data.invitedUsers.length; i++) {

            str += "<div class='col-sm-12 col-xs-12 allcoms community-user-div' style='margin-top:5px;'>";
            str += "<div class='col-sm-2 col-xs-3' style='padding:5px;'>";
            str += "<a href='/viewprofile/" + data.invitedUsers[i]._id + "'><img src='" + data.invitedUsers[i].image + "' class='community-member-pic'>";
            str += "</a></div>";
            str += "<div class='col-sm-8 col-xs-6 scrollable'>";
            str += "<a class='comusername' href='/viewprofile/" + data.invitedUsers[i]._id + "'>" + data.invitedUsers[i].name + "</a>";
            str += "</div>";
            str += "<div class='col-sm-2 col-xs-3'>";

            str += "<a class='community-user-short-btn' onclick='cancelInvite(this,\"" + data.invitedUsers[i]._id + "\",\"" + community_id + "\")' style='float:right'>";
            str += "<i class='fa fa-times'></i></a>";


            str += "</div>";
            str += "</div>";


        }

    }
    else {
        str = "<div class='col-sm-12 allcoms well well-sm' style='margin-top:5px;font-weight:bold'><center>There are no Invitations pending</center></div>";
    }

    return str;


}

function promoteUser(elem, user_id, community_id) {

    var parent = elem.closest('.allcoms');

    $.confirm({
        draggable: false,
        title: 'Promote User',
        content: 'Do you really want to promote this user?',
        buttons: {
            yes: {
                text: 'YES',
                btnClass: 'btn-green',
                action: function () {

                    $.ajax({
                        type: 'POST',
                        url: '/community/promoteuser',
                        contentType: "application/json",
                        data: JSON.stringify({ user_id: user_id, community_id: community_id }),
                        success: function (data) {

                            $(parent).remove();

                            $.ajax({
                                type: 'POST',
                                url: '/community/managecommunity/getcount',
                                contentType: "application/json",
                                data: JSON.stringify({ community_id: community_id }),
                                success: function (data) {
                                    updateManageCommunityBtns(data.countAll);
                                },

                                error: function (jqxhr, err) {
                                    console.log(err);
                                    notie.alert({ type: 3, text: 'Something went wrong in getting total count!', time: 2 });

                                }

                            });

                        },

                        error: function (jqxhr, err) {
                            console.log(err);
                            notie.alert({ type: 3, text: 'Something went wrong!', time: 2 });

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

function demoteUser(elem, user_id, community_id) {

    var parent = elem.closest('.allcoms');

    $.confirm({
        draggable: false,
        title: 'Demote User',
        content: 'Do you really want to demote this user?',
        buttons: {
            yes: {
                text: 'YES',
                btnClass: 'btn-green',
                action: function () {

                    $.ajax({
                        type: 'POST',
                        url: '/community/demoteuser',
                        contentType: "application/json",
                        data: JSON.stringify({ user_id: user_id, community_id: community_id }),
                        success: function (data) {

                            $(parent).remove();

                            $.ajax({
                                type: 'POST',
                                url: '/community/managecommunity/getcount',
                                contentType: "application/json",
                                data: JSON.stringify({ community_id: community_id }),
                                success: function (data) {
                                    updateManageCommunityBtns(data.countAll);
                                },

                                error: function (jqxhr, err) {
                                    console.log(err);
                                    notie.alert({ type: 3, text: 'Something went wrong in getting total count!', time: 2 });

                                }

                            });

                        },

                        error: function (jqxhr, err) {
                            console.log(err);
                            notie.alert({ type: 3, text: 'Something went wrong!', time: 2 });

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


function removeUser(elem, user_id, community_id) {

    var parent = elem.closest('.allcoms');

    $.confirm({
        draggable: false,
        title: 'Remove User',
        content: 'Do you really want to remove this user?',
        buttons: {
            yes: {
                text: 'YES',
                btnClass: 'btn-green',
                action: function () {

                    $.ajax({
                        type: 'POST',
                        url: '/community/removeuser',
                        contentType: "application/json",
                        data: JSON.stringify({ user_id: user_id, community_id: community_id }),
                        success: function (data) {

                            $(parent).remove();

                            $.ajax({
                                type: 'POST',
                                url: '/community/managecommunity/getcount',
                                contentType: "application/json",
                                data: JSON.stringify({ community_id: community_id }),
                                success: function (data) {
                                    updateManageCommunityBtns(data.countAll);
                                },

                                error: function (jqxhr, err) {
                                    console.log(err);
                                    notie.alert({ type: 3, text: 'Something went wrong in getting total count!', time: 2 });

                                }

                            });

                        },

                        error: function (jqxhr, err) {
                            console.log(err);
                            notie.alert({ type: 3, text: 'Something went wrong!', time: 2 });

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

function acceptRequest(elem, user_id, community_id) {

    var parent = elem.closest('.allcoms');

    $.confirm({
        draggable: false,
        title: 'Approve Request',
        content: 'Do you really want to approve this request?',
        buttons: {
            yes: {
                text: 'YES',
                btnClass: 'btn-green',
                action: function () {

                    $.ajax({
                        type: 'POST',
                        url: '/community/acceptrequest',
                        contentType: "application/json",
                        data: JSON.stringify({ user_id: user_id, community_id: community_id }),
                        success: function (data) {

                            $(parent).remove();

                            $.ajax({
                                type: 'POST',
                                url: '/community/managecommunity/getcount',
                                contentType: "application/json",
                                data: JSON.stringify({ community_id: community_id }),
                                success: function (data) {
                                    updateManageCommunityBtns(data.countAll);
                                },

                                error: function (jqxhr, err) {
                                    console.log(err);
                                    notie.alert({ type: 3, text: 'Something went wrong in getting total count!', time: 2 });

                                }

                            });

                        },

                        error: function (jqxhr, err) {
                            console.log(err);
                            notie.alert({ type: 3, text: 'Something went wrong!', time: 2 });

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

function cancelRequest(elem, user_id, community_id) {

    var parent = elem.closest('.allcoms');

    $.confirm({
        draggable: false,
        title: 'Reject Request',
        content: 'Do you really want to reject this request?',
        buttons: {
            yes: {
                text: 'YES',
                btnClass: 'btn-green',
                action: function () {

                    $.ajax({
                        type: 'POST',
                        url: '/community/cancelrequest',
                        contentType: "application/json",
                        data: JSON.stringify({ user_id: user_id, community_id: community_id }),
                        success: function (data) {

                            $(parent).remove();

                            $.ajax({
                                type: 'POST',
                                url: '/community/managecommunity/getcount',
                                contentType: "application/json",
                                data: JSON.stringify({ community_id: community_id }),
                                success: function (data) {
                                    updateManageCommunityBtns(data.countAll);
                                },

                                error: function (jqxhr, err) {
                                    console.log(err);
                                    notie.alert({ type: 3, text: 'Something went wrong in getting total count!', time: 2 });

                                }

                            });

                        },

                        error: function (jqxhr, err) {
                            console.log(err);
                            notie.alert({ type: 3, text: 'Something went wrong!', time: 2 });

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

function cancelInvite(elem, user_id, community_id) {

    var parent = elem.closest('.allcoms');

    $.confirm({
        draggable: false,
        title: 'Cancel Invite',
        content: 'Do you really want to cancel this invite?',
        buttons: {
            yes: {
                text: 'YES',
                btnClass: 'btn-green',
                action: function () {

                    $.ajax({
                        type: 'POST',
                        url: '/community/cancelinvite',
                        contentType: "application/json",
                        data: JSON.stringify({ user_id: user_id, community_id: community_id }),
                        success: function (data) {

                            $(parent).remove();

                            $.ajax({
                                type: 'POST',
                                url: '/community/managecommunity/getcount',
                                contentType: "application/json",
                                data: JSON.stringify({ community_id: community_id }),
                                success: function (data) {
                                    updateManageCommunityBtns(data.countAll);
                                },

                                error: function (jqxhr, err) {
                                    console.log(err);
                                    notie.alert({ type: 3, text: 'Something went wrong in getting total count!', time: 2 });

                                }

                            });

                        },

                        error: function (jqxhr, err) {
                            console.log(err);
                            notie.alert({ type: 3, text: 'Something went wrong!', time: 2 });

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
