

//Todo : Have to remove this file not used by any function now.

var saveData = function() {
//alert("inside the function savedata now")
//		var user = {}
	var	name = $("#username").val();
	var	password = $("#password").val();
//alert("name is"+name)
                $.ajax({
                 headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                    url: '/signup/'+name+'/'+password,
                    type: 'GET',
                    dataType: 'text',
                     mode: 'no-cors',
                    success: function(response) {
                        if (response == 'Successfully signed up') {
                        alert("Successfully signed up!!");
                            window.location.href = "http://localhost:8989/loginPage";
                        }
                    },
                         error:function(data,status,er) {
//                         alert("error: "+data+" status: "+status+" er:"+er);
                       }
                });
            }





var authenticate = function() {
//alert("inside the function now")
//		var user = {}
	var	name = $("#username").val();
	var	password = $("#password").val();
//alert("name is"+name)
                $.ajax({
                 headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                    url: '/login/'+name+'/'+password,
                    type: 'GET',
                    dataType: 'text',
                     mode: 'no-cors',
                    success: function(response) {
                        if (response != 'Invalid') {
                         alert("Success!!");
//                                                $('#result').html(response);
                        window.location.href = "http://localhost:8989/userProfile/"+name;
                        }
                        else{
                        alert("Invalid user name or password!!")
                        }
                    },
                         error:function(data,status,er) {
                         alert("error: "+data+" status: "+status+" er:"+er);
                       }
                });
            }
