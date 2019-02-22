$('#admin_change_password_submit').on('click', function () {
    var old_password = $('#old_Password').val();
    var new_password = $('#new_Password').val();
    var confirm_password = $('#confirm_Password').val();

    if(old_password == '' || new_password == '' || confirm_password == '') {
        $.alert({
            title: 'Alert !',
            content: 'Old password or New password or Confirm password filed can not be left blank.',
            // icon: 'fa fa-rocket',
            animation: 'scale',
            closeAnimation: 'scale',
            buttons: {
                okay: {
                    text: 'Okay',
                    btnClass: 'btn-blue'
                }
            }
        });
    }else if (new_password != confirm_password) {
        $.alert({
            title: 'Alert !',
            content: 'New password and Confirm password should be same.',
            animation: 'scale',
            closeAnimation: 'scale',
            buttons: {
                okay: {
                    text: 'Okay',
                    btnClass: 'btn-blue'
                }
            }
        });
    }else {
        $.ajax({
            type : "POST",
            url : "/admin/changePassword",
            data : {
                old_password : old_password,
                confirm_password : confirm_password
            },
            success : function (result) {
                if(result.status == 200) {
                    $.alert({
                        title: 'Confirmation !',
                        content: result.message,
                        animation: 'scale',
                        closeAnimation: 'scale',
                        buttons: {
                            okay: function (){
                                window.location.reload();
                            }
                        }
                    });
                }else {
                    $.alert({
                        title: 'Alert !',
                        content: result.message,
                        animation: 'scale',
                        closeAnimation: 'scale',
                        buttons: {
                            okay: function() {
                                $('#old_Password').val('');
                                $('#new_Password').val('');
                                $('#confirm_Password').val('');
                            }
                        }
                    });
                }
            }
        })
    }
});