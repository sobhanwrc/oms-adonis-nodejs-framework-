$(document).ready( function() {
    var today = new Date();
    $('#valid_to').datepicker({
        changeMonth: true,
        changeYear: true,
        minDate: today
    });

    $('#coupon_add_submit').on('click', function () {
        var valid_check = $('#coupon_add_form').valid();
        if(valid_check) {
            var coupon_type = $('#coupon_type').val();
            if(coupon_type > 0) {
                $('#coupon_add_form').submit();
            }else{
                alert ("Please select coupon type.");
                return false
            }
        }
    })

    $('#coupon_add_form').validate({
        rules : {
            coupon_code : {
                required : true
            },
            coupon_desc : {
                required : true
            },
            coupon_amount : {
                required : true
            },
            valid_to : {
                required : true
            }
        },
        messages : {
            coupon_code : {
                required : "<font color ='red'> Please enter coupon code.</font>"
            },
            coupon_desc : {
                required : "<font color ='red'> Please enter coupon description.</font>"
            },
            coupon_amount : {
                required : "<font color ='red'> Please enter coupon amount.</font>"
            },
            valid_to : {
                required : "<font color ='red'> Please enter coupon expiration date.</font>"
            }
        }
    })

    $('#coupon_edit_submit').on('click', function () {
        var valid_check = $('#coupon_edit_form').valid();
        if(valid_check) {
            var coupon_type = $('#coupon_type').val();
            if(coupon_type > 0) {
                $('#coupon_edit_form').submit();
            }else{
                alert ("Please select coupon type.");
                return false
            }
        }
    })

    $('#coupon_edit_form').validate({
        rules : {
            coupon_code : {
                required : true
            },
            coupon_desc : {
                required : true
            },
            coupon_amount : {
                required : true
            },
            valid_to : {
                required : true
            }
        },
        messages : {
            coupon_code : {
                required : "<font color ='red'> Please enter coupon code.</font>"
            },
            coupon_desc : {
                required : "<font color ='red'> Please enter coupon description.</font>"
            },
            coupon_amount : {
                required : "<font color ='red'> Please enter coupon amount.</font>"
            },
            valid_to : {
                required : "<font color ='red'> Please enter coupon expiration date.</font>"
            }
        }
    })

    $('#select_coupon').on('change', function () {
        var coupon_id = $('#select_coupon').val();
        if(coupon_id != 0 ){
            $.ajax({
                type : "POST",
                url : "/admin/assign/coupon/fetch_coupon_desc",
                data : {
                    coupon_id : coupon_id
                },
                success : function (result) {
                    if(result != ''){
                        $('#coupon_description').val(result);
                    }
                }
            })
        }else {
            $('#coupon_description').val(''); 
        }
    })
})