$('#admin_change_password_submit').on('click', function () {
    var valid = $('#change_password_form').valid();
    console.log(valid,'valid');
    if(valid) {
        alert ($('#old_Password').val());
    }
});

$('#change_password_form').validate({
    rules:{
        old_Password:{
            required : true
        },
        new_Password : {
            required : true
        },
        confirm_Password : {
            required : true
        }
    },
    messages:{
        old_Password:{
            required : "<font color='red'>Please enter your old password.</font>"
        },
        new_Password : {
            required : "<font color='red'>Please enter your new password.</font>"
        },
        confirm_Password : {
            required : "<font color='red'>Please enter your confirm password.</font>"
        }
    }
});