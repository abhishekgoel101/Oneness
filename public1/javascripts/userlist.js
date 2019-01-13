var embtn = '<center><a class="btn btn-primary btn-sm emailbtn actionbtns" style="background:#000"><span class="fa fa-envelope" style="color:#fff"></span></a>';
var edbtn = '<a class="btn btn-primary btn-sm editbtn actionbtns"><span class="fa fa-edit"></span></a>';
//var debtn='<a class="btn btn-danger btn-sm deletebtn actionbtns"><span class="fa fa-trash"></span></a>';
var acbtn = '<a class="btn btn-success btn-sm acbtn actionbtns" id=""><span class="fa fa-check-circle"></span></a></center>';
var deacbtn = '<a class="btn btn-warning btn-sm deacbtn actionbtns" id=""><span class="fa fa-times-circle"></span></a></center>';

$.fn.dataTable.ext.errMode = 'throw';

var table = $('#usertable').DataTable({
    "lengthMenu": [10, 25, 50],
    "serverSide": true,
    "processing": true,
    'columns': [
        { 'title': 'User Id', 'data': '_id', 'orderable': false, 'searchable': false, 'sClass': 'tableId' },
        { 'title': 'Username/Email', 'data': 'email', 'orderable': true, 'searchable': true, 'sClass': 'tableUname' },
        { 'title': 'Phone', 'data': 'phone', 'orderable': false, 'searchable': false, 'sClass': 'tablePhone' },
        { 'title': 'City', 'data': 'city', 'orderable': true, 'searchable': true, 'sClass': 'tableCity' },
        { 'title': 'Status', 'data': 'status', 'orderable': true, 'searchable': false, 'sClass': 'tableStatus' },
        { 'title': 'Role', 'data': 'role', 'orderable': true, 'searchable': false, 'sClass': 'tableRole' },
        { 'title': 'Active', 'data': 'activated', 'orderable': false, 'searchable': false, 'sClass': 'tableActivated' },
        { title: "Actions", data: null, 'orderable': true, 'searchable': false, 'sClass': 'tableAction' },
    ],
    "order": [[1, "asc"]],

    'ajax': {
        'url': '/admin/userlist',
        'type': 'POST',
        'data': function (d) {
            d.roleFilter = $('#roleFilter').val();
            d.statusFilter = $('#statusFilter').val();
        },
    },
    'createdRow': function (row, data, index) {
        var str = "";
        str += embtn;
        str += edbtn;

        if (data.activated) {
            str += deacbtn;
        }
        else {
            str += acbtn;
        }

        //console.log($('td', row));
        //tds here will only be 6 as the tds that are shown in html are there only. 

        $('td', row).eq(7).html(str);


        if ($('td', row).eq(4).html() == 'true') {
            $('td', row).eq(4).html('Confirmed')
        } else {
            $('td', row).eq(4).html('Pending')
        }

    }


});


function refresh() {
    table.ajax.reload(null, false);
}

$(document).ready(function () {

    $('#roleFilter').on('change', function () {
        table.ajax.reload(null, false);
    });

    $('#statusFilter').on('change', function () {
        table.ajax.reload(null, false);
    });

    $('#usertable').fadeIn(2000);

    $('#usertable').on('click', '.emailbtn', function () {

        var tds = $(this).closest('tr').children('td');

        $('#emailPop').val(tds[1].innerHTML);
        $('#subject').val('This mail is from Oneness');
        $('#body').trumbowyg('empty');
        $('#popUp').modal('show');

    });

    $('#usertable').on('click', '.editbtn', function () {

        var tds = $(this).closest('tr').children('td');

        $('#usernamePop').html('Update ' + tds[1].innerHTML);

        $('#_id').val(tds[0].innerHTML);
        $('#username').val(tds[1].innerHTML);
        document.getElementById('username').setAttribute('old', tds[1].innerHTML);

        $('#phone').val(tds[2].innerHTML);
        $('#city').val(tds[3].innerHTML);
        if (tds[4].innerHTML == 'Confirmed') {

            $('#status').val('true');
        }
        else {

            $('#status').val('false');
        }

        $('#updateUser').modal('show');
        $('#role').val(tds[5].innerHTML);

    });

    $('#usertable').on('click', '.acbtn', function () {

        var tds = $(this).closest('tr').children('td');
        var username = tds[1].innerHTML;
        var id = tds[0].innerHTML;
        $.confirm({
            title: 'Activate User ?',
            content: "Are you sure you want to activate " + " \"" + username + "\"",
            buttons: {
                'Yes': {
                    btnClass: 'btn-success',
                    action: function () {
                        $.ajax({
                            type: 'POST',
                            data: JSON.stringify({ id: id, email: username, activated: true }),
                            contentType: 'application/json',
                            url: '/admin/activation',
                            success: function (response) {
                                tds[6].innerHTML = 'true';
                                tds[7].innerHTML = embtn + edbtn + deacbtn;
                                notie.alert({ type: 1, text: 'User ' + username + ' Activated', time: 2 })
                            },
                            error: function (response) {
                                notie.alert({ type: 3, text: 'Unable to activate Something went wrong', time: 2 })
                            }
                        });
                    }
                },
                'No': { btnClass: 'btn-danger', }
            }
        });

    });

    $('#usertable tbody').on('click', '.deacbtn', function () {

        var tds = $(this).closest('tr').children('td');
        var username = tds[1].innerHTML;
        var id = tds[0].innerHTML;

        $.confirm({
            title: 'Deactivate User ?',
            content: "Are you sure you want to Deactivate " + " \"" + username + "\"",
            buttons: {
                'Yes': {
                    btnClass: 'btn-success',
                    action: function () {
                        $.ajax({
                            type: 'POST',
                            data: JSON.stringify({ id: id, email: username, activated: false }),
                            contentType: 'application/json',
                            url: '/admin/activation',
                            success: function (response) {
                                tds[6].innerHTML = 'false';
                                tds[7].innerHTML = embtn + edbtn + acbtn;
                                notie.alert({ type: 1, text: 'User ' + username + ' Deactivated', time: 2 })
                                if (response.mydeactivate) {
                                    window.location.href = "/admin/userlist";
                                }
                            },
                            error: function (response) {
                                notie.alert({ type: 3, text: 'Unable to deactivate. Something went wrong', time: 2 })
                            }
                        });
                    }
                },
                'No': { btnClass: 'btn-danger', }
            }
        });

    });

    $('#updateDetails').submit(function (e) {
        e.preventDefault();

        var username_value = (document.getElementById('username').value).trim().toLowerCase();

        if (username_value) {
            $.ajax({
                type: 'POST',
                url: '/admin/checkuser',
                contentType: "application/json",
                data: JSON.stringify({ username: username_value }),
                success: function (data) {
                    if (data.valid || username_value == (document.getElementById('username').getAttribute('old'))) {
                        if (!validatePhone(document.getElementById('phone').value)) {
                            $.alert({
                                title: 'Inavlid! Phone Number',
                                content: 'Phone number is not valid',
                            });

                        }
                        else {
                            var id = document.getElementById('_id').value;
                            var phone = document.getElementById('phone').value;
                            var city = document.getElementById('city').value;
                            var status = document.getElementById('status').value;
                            if (status == "true") { status = true; }
                            else {
                                status = false;
                            }
                            var role = document.getElementById('role').value;
                            var oldemail = document.getElementById('username').getAttribute('old');
                            var details = {
                                id: id,
                                email: username_value,
                                oldemail: oldemail,
                                phone: phone,
                                city: city,
                                status: status,
                                role: role
                            };
                            $('#updateUser').modal('hide');
                            $.ajax({
                                type: 'POST',
                                url: '/admin/updateuser',
                                contentType: "application/json",
                                data: JSON.stringify(details),
                                success: function (response) {
                                    if (response.myupdate) {
                                        notie.alert({ type: 1, text: username_value + ' Updated', time: 2 });
                                        window.location.href = "/admin/userlist";
                                    }
                                    else {
                                        table.ajax.reload(null, false);
                                        notie.alert({ type: 1, text: username_value + ' Updated', time: 2 });
                                    }
                                },
                                error: function (response) {
                                    notie.alert({ type: 3, text: 'Unable to update Something went wrong', time: 2 })
                                }

                            });


                        }

                    }
                    else {
                        $.alert({
                            title: 'Inavlid!',
                            content: 'User already exist',
                        });

                    }

                },
                error: function (jqxhr, err) {
                    console.log(err);
                }

            });

        }




    });

    $('#emailSend').submit(function (e) {
        e.preventDefault();
        var to = $('#emailPop').val();
        var subject = $('#subject').val();
        var mbody = $('#body').trumbowyg('html');
        $('#popUp').modal('hide');
        console.log("yoooooooooooo");
        var details = {
            to: to,
            subject: subject,
            body: mbody,
        };
        $.ajax({
            type: 'POST',
            url: '/admin/sendmail',
            contentType: "application/json",
            data: JSON.stringify(details),

            success: function (response) {
                notie.alert({ type: 1, text: 'Email Sent To ' + to, time: 2 })
            },
            error: function (err) {
                notie.alert({ type: 3, text: 'Something went wrong Email Not sent to ' + to, time: 2 })

            }

        });


    });


}); 