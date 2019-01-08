var userTypeForCommunity = function (user_id, community) {

    if (community.owner) {
        if (community.owner._id == user_id) {
            return "Owner";
        }
    }
    if (community.admins) {

        for (var i = 0; i < community.admins.length; i++) {
            if (community.admins[i]._id == user_id) {
                return "Admin";
            }
        }
    }

    if (community.members) {

        for (var i = 0; i < community.members.length; i++) {
            if (community.members[i]._id == user_id) {
                return "Member";
            }
        }
    }

    if (community.requests) {

        for (var i = 0; i < community.requests.length; i++) {
            if (community.requests[i]._id == user_id) {
                return "Requested";
            }
        }
    }

    if (community.invitedUsers) {

        for (var i = 0; i < community.invitedUsers.length; i++) {
            if (community.invitedUsers[i]._id == user_id) {
                return "Invited";
            }
        }
    }

    return "Guest";
}

module.exports = userTypeForCommunity;