var edbtn = '<a class="btn btn-sm editbtn actionbtns" style="margin-top:35px;background-color: #2D312C;color: #fff"><span class="fa fa-edit"></span></a>';
var debtn = '<a class="btn btn-sm deletebtn actionbtns" style="margin-top:35px;background-color: #2D312C;color: #fff"><span class="fa fa-trash"></span></a>';
var info = '<a class="btn btn-sm infobtn actionbtns" style="margin-top:35px;background-color: #2D312C;color: #fff"><span class="fa fa-info"></span></a>';
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


var table = $('#communitytable').DataTable({
    "lengthMenu": [10, 25, 50],
    "serverSide": true,
    "processing": true,
    'columns': [
        { 'title': 'Community Id', 'data': '_id', 'orderable': false, 'searchable': false, 'sClass': 'ComTableId' },
        { 'title': 'Community Name', 'data': 'name', 'orderable': true, 'searchable': true, 'sClass': 'ComTableName' },
        { 'title': 'Membership Rule', 'data': 'rule', 'orderable': true, 'searchable': false, 'sClass': 'ComTableRule' },
        { 'title': 'Community Location', 'data': 'location', 'orderable': true, 'searchable': true, 'sClass': 'ComTableLocation' },
        { 'title': 'Community Owner', 'data': 'owner.name', 'orderable': false, 'searchable': false, 'sClass': 'ComTableAdmin' },
        { 'title': 'Date Created', 'data': 'dateCreated', 'orderable': true, 'searchable': false, 'sClass': 'ComTableDate' },
        { 'title': 'Actions', 'data': null, 'orderable': false, 'searchable': false, 'sClass': 'tableAction' },
        { title: "Community Pic", 'data': 'image', 'orderable': false, 'searchable': false, 'sClass': 'ComTableImage' },
        { title: "", data: 'status', 'orderable': false, 'searchable': false, 'sClass': 'ComTableActive' },

    ],
    "order": [[1, "asc"]],

    'ajax': {
        'url': '/admin/communitylist',
        'type': 'POST',
        'data': function (d) {
            d.ruleFilter = $('#CommunityRuleFilter').val();
        },
    },
    'createdRow': function (row, data, index) {
        var state;

        if (data.status == 'Activated') {
            state = ';border: 4px solid green;'
        } else {
            state = ';border: 4px solid red;'
        }

        function FullDate(dateObj) {
            var date = dateObj.getDate();
            var year = dateObj.getFullYear();
            var month = months[parseInt(dateObj.getMonth())];
            return date + '-' + month + '-' + year;
        }
        var dateObj = new Date(data.dateCreated);
        dateCreated = FullDate(dateObj);


        $('td', row).eq(5).html(dateCreated);

        $('td', row).eq(6).html(edbtn + info);

        $('td', row).eq(7).html('<img src="' + data.image + '" style="width:80px;height:80px' + state + '">');

    }


});


function refresh() {
    table.ajax.reload(null, false);
}


$(document).ready(function () {
    $('#CommunityRuleFilter').on('change', function () {
        table.ajax.reload(null, false);
    });
    $('#communitytable').fadeIn(2000); // show table in fade animation
    /*--------Pop Edit With Value------------------------------------------------*/
    $("#communitytable").on("click", ".editbtn", function () {

        var tds = $(this).closest('tr').children('td');

        $('#CommunityNamePop').html('Update ' + tds[1].innerHTML);

        $('#CommunityAdminPop').html('Created by ' + tds[4].innerHTML + ' , ' + tds[5].innerHTML);

        $('#_id').val(tds[0].innerHTML);

        $('#CommunityName').val(tds[1].innerHTML);

        $('#CommunityStatus').val(tds[8].innerHTML);

        $('#updateCommunity').modal('show');

    });

    /*---------------------Update Edit----------------------------------------*/

    $('#updateDetails').submit(function (e) {
        e.preventDefault();

        var _id = $('#_id').val();
        var name = ($('#CommunityName').val()).trim();
        var status = $('#CommunityStatus').val();
        var data = {};
        data._id = _id;
        data.name = name;
        data.status = status;

        $('#updateCommunity').modal('hide');

        $.ajax({
            type: 'POST',
            url: '/admin/updatecommunity',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {

                table.ajax.reload(null, false);
                notie.alert({ type: 1, text: name + ' Updated', time: 2 });
            },
            error: function (response) {
                notie.alert({ type: 3, text: 'Unable to update Something went wrong', time: 2 })
            }

        });


    });

    //---------------Community Info-------------------------------------------------*/

    $("#communitytable").on("click", ".infobtn", function () {
        var tds = $(this).closest('tr').children('td');

        var pic = (tds[7].innerHTML).toString();
        pic = pic.match('src\s*=\s*"([^"]+)"')[1];

        var data = {};
        data._id = tds[0].innerHTML;

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/admin/getcommunityinfo',
            success: function (response) {

                var lessDesc = (response.description).replace(/<(?:.|\n)*?>/gm, '').substring(0, 200);
                if (response.description.length > 200) {
                    lessDesc += lessDesc + '......';
                }

                $('#communityDesc').html(lessDesc);
                $('#CommunityProfilePic').attr('src', pic);
                $('#CommunityInfoPop').html(tds[1].innerHTML);

                $('#CommunityInfo').modal('show');

            },
            error: function (response) {
                notie.alert({ type: 3, text: 'Unable to show Info Something went wrong', time: 2 })
            }
        });


    });

    //--------------------------------------------------------------------------
});

