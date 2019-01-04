var valid_time_reg = /((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/;
var youtubeReg = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
var youtubeIdReg = /^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/
//-------------------------------Number of days--------------------------------------
function NumberOfDays(currentTime, postedTime) {
    var a = Date.UTC(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
    var b = Date.UTC(postedTime.getFullYear(), postedTime.getMonth(), postedTime.getDate())
    var Days = (a - b) / 86400000;
    if (Days == 0) {
        var d = new Date(postedTime);
        var resultTime = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        return resultTime;
    } else {
        return Days + 'd';


    }
}

function OnlyDate(str) {
    if (str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [day, mnth, date.getFullYear()].join("/");
    }
    else {
        return ' Not Updated'
    }
}

function OnlyDateEditProfile(str) {
    if (str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [day, mnth, date.getFullYear()].join("/");
    }
    else {
        return '';
    }
}

$('.dobDatePop').text(OnlyDate($('.dobDatePop').text()));


function validImage(input) {
    var files = input.files;
    if (files && files[0]) {
        if (!files[0].type.match('image.*')) {

            $.alert({
                title: 'Invalid Image',
                content: 'Image Format is Invalid',
            });
            input.value = "";
            return false;

        }
        else if (files[0].size < 40000 || files[0].size > 1024000) {
            $.alert({
                title: 'Invalid Image',
                content: 'Image should be > 40 KB and <1MB',
            });

            input.value = "";
            return false;
        }
        return true;

    }
}

function switchState(mode) {
    if (mode == 'Admin') {
        mode = 'User';
    }
    else {
        mode = 'Admin';
    }

    $.confirm({
        draggable: false,
        title: 'Switch As ' + mode,
        content: 'Do you really want to switch state...',
        buttons: {
            yes: {
                text: 'YES',
                btnClass: 'btn-green',
                action: function () {
                    if (mode === 'User') {
                        window.location.href = "/admin/switchState/User";
                    }
                    else {
                        window.location.href = "/admin/switchState/Admin";
                    }

                }
            },

            no: {
                text: 'NO',
                btnClass: 'btn-red',

            }

        }
    });


}

function logout() {
    $.confirm({
        draggable: false,
        title: 'Confirm Logout!',
        content: 'Do you really want to logout?',
        buttons: {
            yes: {
                text: 'YES',
                btnClass: 'btn-green',
                action: function () {
                    window.location.href = "/logout";
                }

            },
            no: {
                text: 'NO',
                btnClass: 'btn-red',

            }

        }
    });

}

function validatePhone(phone) {
    if (phone.match(/^\d{10}$/) == null) {
        return false;
    }
    else {
        return true;
    }

}

/*
var username=document.getElementById('username');

var form=document.getElementById('form');


form.onsubmit=function(e)
{
 e.preventDefault();
 var username_value=username.value.trim().toLowerCase();

if(username_value)
{
  $.ajax({
    type:'POST',
    url:'/admin/checkuser',
    contentType : "application/json",
    data:JSON.stringify({username:username_value}),
    success:function(data){
        if(data.valid)
        {
            if(!validatePhone(document.getElementById('phone').value))
            {
                $.alert({
                    title: 'Inavlid! Phone Number',
                    content: 'Phone number is not valid',
                });

            }
            else
            {
                username.value=username_value;
                form.submit();
            }

        }
        else
        {
            $.alert({
                title: 'Inavlid!',
                content: 'User already exist',
            });

        }

    },
    error:function(jqxhr,err){
        console.log(err);
        }

    });

}

}
*/

/*

<script>

$('#changeProfilePicBtn').on('click',function(){
$('#profileUpload').trigger('click');
});
$('#profileUpload').on('change',function(){
if(validImage(this))
{
readURL(this);

}

});


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#user-profile-image').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}


    var form=document.getElementById('editProfile');

    form.onsubmit=function(e)
    {
        e.preventDefault();

        if(!validatePhone(document.getElementById('phone').value))
        {
            $.alert({
                title: 'Inavlid! Phone Number',
                content: 'Phone number is not valid',
            });

        }
        else
        {
            if(document.getElementById('profileUpload').value=="")
            {

                $.confirm({
                draggable:false,
                title: 'Default Image Upload',
                content: 'Latest Image uploaded was invalid.Default image will be uploaded.Do you want to upload valid image?',
                buttons: {
                    yes:{
                    text: 'YES',
                    btnClass: 'btn-green'

                    },
                    no:{
                    text: 'NO',
                    btnClass: 'btn-red',
                    action: function(){
                        form.submit();
                        }
                      }

                    }
                });

            }
            else
            {
            form.submit();
            }

        }


    }


</script>

*/

