

var user_list = [];
var userTable = null;
var wash_details  = 1000;

$(document).ready(function () {
    $(".leftMenu").removeClass('active')
    $(".records").addClass('active')
    loadorgmanagementList();
    addRowHandlers();

});

function addRowHandlers() {
    var table = document.getElementById("orgmanagement1");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler = 
            function(row) 
            {
                return function() { 
                                        var cell = row.getElementsByTagName("td")[0];
                                        var id = cell.innerHTML;
                                        alert("id:" + id);
                                 };
            };

        currentRow.onclick = createClickHandler(currentRow);
    }
}


function loadorgmanagementList() {


    if (userTable) {
        userTable.destroy();
        $("#orgmanagement1").html("");
    }

    var fields = [
        {
            mData: 'washid',
            sTitle: 'Wash ID',
            orderable: false,
            mRender: function (data, type, row) {

                var r = '<a  href="#" onclick="washingDetails(' + row['washid'] + '\'' + ')">'+'</a>' 
                return data ? data : r;

            }
        },
        {
            mData: 'washname',
            sTitle: 'Wash Name',
            orderable: false,
            mRender: function (data, type, row) {
                return data ? data : "-";

            }

        },
        {
            mData: 'power',
            sTitle: 'Power',
            orderable: false,
            mRender: function (data, type, row) {
                return data ? data : "-";

            }
        },
        {
            mData: 'stage',
            sTitle: 'Stage',
            orderable: false,
            mRender: function (data, type, row) {

                return data ? data : r;
                
            }
        },
        {
            mData: 'lint',
            sTitle: 'Lint',
            orderable: false,
            mRender: function (data, type, row) {

                return data ? data : "-";

            }
        },
        {
            mData: 'action',
            sTitle: 'Action',
            orderable: false,
            mRender: function (data, type, row) {

                  var r = '<span>'+'<a class="" style="cursor:pointer;color:#007bff;"  data-toggle="modal" data-target="#washdetails"  href="#" onclick="edit(' + '\'' + row["_id"] + '\'' + ', ' + '\'' + row['washid'] + '\'' + ', ' + '\'' + row['washname'] + '\'' + ',' + '\'' + row['power'] + '\'' + ',' + '\'' + row['stage'] + '\'' + ', ' + '\'' + row['lint'] + '\'' + '\)"><i class="fa fa-edit"></i>  Edit</a>' +
                    '<a class="" href="#" style="margin-left: 15px;color:red;cursor:pointer" onclick="del(' + '\'' + row["_id"] + '\'' + ', ' + '\'' + row['washid'] + '\'' + ')"><i class="fa fa-trash"></i>  Delete</a>'+
                    '<a class="" href="#" style="margin-left: 15px;color:gray;cursor:pointer;" onclick="washingDetails(' + '\'' + row["_id"] + '\'' + ', ' + '\'' + row['washid'] + '\'' + ', ' + '\'' + row['washname'] + '\'' + ',' + '\'' + row['power'] + '\'' + ',' + '\'' + row['stage'] + '\'' + ', ' + '\'' + row['lint'] + '\'' +')"><i class="icon-eye2"></i>  Wash Details</a>'+'</span>'
                   



                return data ? data : r;

            }
        },

    ];

var tableOption = {
        fixedHeader: {
            header: true,
            headerOffset: -5
        },
        responsive: true,
        paging: true,
        searching: true,
        "ordering": true,
        iDisplayLength: 10,
        lengthMenu: [[10, 50, 100], [10, 50, 100]],
        aoColumns: fields,
        data: []
    };
 var queryParams = {
        "query": {
            "bool": {
                "must": [{
                    match: { domainKey: DOMAIN_KEY }
                }
                ]
            }
        },
        "size": 1000,
        sort: {

        }
    };
 var searchQuery = {
        "method": 'GET',
        "extraPath": "",
        "query": JSON.stringify(queryParams),
        "params": []
    };
    console.log(searchQuery);
    searchByQuery(wash_details, 'RECORD', searchQuery, function (status, data) {
        if (status) {
            console.log(data);
            var resultData = searchQueryFormatter(data).data;
            console.log(resultData);
            var resData = resultData['data'];
            console.log(resData);
            tableOption['data'] = resData;






        } else {
        }
        userTable = $("#orgmanagement1").DataTable(tableOption);
    });
}



function searchQueryFormatter(data) {

    var resultObj = {
        total: 0,
        data: {},
        aggregations: {}
    }

    if (data.httpCode === 200) {

        var arrayData = JSON.parse(data.result);

        var totalRecords = arrayData.hits.total;
        var records = arrayData.hits.hits;

        var aggregations = arrayData.aggregations ? arrayData.aggregations : {};


        for (var i = 0; i < records.length; i++) {
            records[i]['_source']['_id'] = records[i]['_id'];
        }

        resultObj = {
            "total": totalRecords,
            "data": {
                "recordsTotal": totalRecords,
                "recordsFiltered": totalRecords,
                "data": _.pluck(records, '_source')
            },
            aggregations: aggregations
            // data : _.pluck(records, '_source')
        }

        $(".eventCount").html(totalRecords)


        return resultObj;

    } else {

        return resultObj;

    }

}

function openModal() {
    $("#Adddetails form")[0].reset();
    $("#Adddetails").modal('show');
    $("#Adddetails form").attr('onsubmit', 'adddetails()');

}

function adddetails() {

    var oi = $("#wash_id").val();
    var on = $("#wash_name").val();
    var od = $("#wash_power").val();
    var oa = $("#wash_stage").val();
    var op = $("#wash_lint").val();
    
    bool_value = od == "true" ? true : false;
    var details = {
        washid: parseInt(oi),
        washname: on,
        power: bool_value,
        stage: oa,
        lint: parseInt(op)
    }
    console.log(details);
    //var recordId = 10000;
    insertRecord(wash_details, details, function (status, data) {
        if (status) {
            successMsg('Record Created Successfully');
            $("#Adddetails").modal('hide');
            loadorgmanagementList();

        } else {
            errorMsg('Error in Creating Record')
            console.log(data)
        }

    })
   
}

function edit(i, a, b, c, d, e) {
   
    var uname = document.getElementById("edit_id");
         uname.setAttribute("value", a);
    var uoffice = document.getElementById("edit_name");
               uoffice.setAttribute("value", b);
   var uschool = document.getElementById("edit_power");
               uschool.setAttribute("value", c);
    var ucollage = document.getElementById("edit_stage");
               ucollage.setAttribute("value", d);
    var uroll = document.getElementById("edit_lint");
               uroll.setAttribute("value", e);
    
                                   

    $("#Editdetails form")[0].reset();


    $("#Editdetails").modal('show');
    $("#organization_edit").click(function () {
        var f = $("#edit_id").val();
        var g = $("#edit_name").val();
        var h = $("#edit_power").val();
        var j = $("#edit_stage").val();
        var k = $("#edit_lint").val();
        

        var name;
        var office;
        var school;
        var collage;
        var roll;
        var scale;

        if (f != "") {
            name = f;
        }
        else {
            name = a;
        }
        if (g != "") {
            office = g;
        }
        else {
            office = b;
        }
        if (h != "") {
            school = h;
        }
        else {
            school = c;
        }


        if (j != "") {
            collage = j;
        }
        else {
            collage = d;
        }
        if (k != "") {
            roll = k;
        }
        else {
            roll = e;
        }
        
        var obj = {

            'washid': name,
            'washname': office,
            'power': school,
            'stage': collage,
            'lint': roll,
        }

        console.log(obj);
        console.log(i);
        updateRecords(wash_details,i, obj,function( status, data){
            if(status){
             successMsg('Record Updated Successfully');
              $("#Editdetails").modal('hide');
              loadorgmanagementList();
            }
            else{
                errorMsg('Error in Updated Record')
            }
        } )
          



    })

}


function updateRecords(rid, rkey, obj, cbk){
    $.ajax({
        url: API_BASE_PATH + "/record/insert/static/" + API_TOKEN + '/' + rid + '/' + rkey,
        data: JSON.stringify(obj),
        contentType: "text/plain",
        type: 'POST',
        success: function (data) {
            cbk(true,data)
        },
        error: function (e) {
            cbk(false,e)
        }
       
    });
}


function del(id, org) {
   console.log(org);
   console.log(id);
    deleteRecord(wash_details, id, function (status, data) {
        
        
        if (status) {
            
          
            //del_second(org);
            //del_char(org);
            successMsg('All Record Deleted Successfully');
            loadorgmanagementList();
            
        }
    })
       tableOption['data']=resData;

}

function washingDetails(iw, aw, bw, cw, dw, ew){

   // $("#washdetails form")[0].reset();


    $("#washdetails").modal('show');
   
    
    console.log("washing Data");
    var washId = aw;
    
    $(".washingiid").html(washId);
    var washName = bw;
    $(".washinginame").html(washName);
    var washPower = cw;
    $(".washingipower").html(washPower);
    var washStage = dw;
    $(".washingistage").html(washStage);
    var washLint = ew;
    $(".washingilint").html(washLint);

    if(washStage == "wash"){
       
        $(".dynamic_img img:last-child").remove();
        $('<img src="https://api.boodskap.io/files/download/6fc962fb-18c4-42cf-a014-e24b2341c3f3/e83127d1-6717-429f-af25-f3030cc256aa">').appendTo(".dynamic_img");
       
    }else if(washStage == "rinse"){
        $(".dynamic_img img:last-child").remove();
        $('<img src="https://api.boodskap.io/files/download/6fc962fb-18c4-42cf-a014-e24b2341c3f3/a69e4965-e5cb-43c2-baf7-c516bf46638e">').appendTo(".dynamic_img");
       
    }else if(washStage == "spin"){
        $(".dynamic_img img:last-child").remove();
        $('<img src="https://api.boodskap.io/files/download/6fc962fb-18c4-42cf-a014-e24b2341c3f3/8055e2e4-3aad-43fd-b996-9328a8bd28b7">').appendTo(".dynamic_img");
       
    }else{
        $(".dynamic_img img:last-child").remove();
        $('<img src="https://api.boodskap.io/files/download/6fc962fb-18c4-42cf-a014-e24b2341c3f3/f1611e64-e462-4de5-9784-35ed5ec3fc09">').appendTo(".dynamic_img");
       
    }
    


}
