var siteAdress = "http://ext.orbitum.com/json_app.php";
var data1 = 0;
var val = 0;
var elem;
var main = function(){
	$('#sync, #async').hide();
	$('#firstGet').click(function(){
		var currentButton = $(this);	
		load().then(function(data){
			console.log(data);
			data1 = parse(data);
			//�������� ������. �������� ������, ������� ������, ��������� 2 ������ � ������. ������ - � data1
			console.log("data1="+data1);
			//������� ������
			currentButton.hide();
			//������� ������
			$('body').append('<p>���-�� ����������: '+data1+'</p>');
			//�������� 2 ������
			$('#sync, #async').show();
			//������ ������
			for (var i=0; i<(data1); i++){
				$('body').append('<p class="oper" id="'+(i+1)+'">�������� �['+(i+1)+']: </p>');
			}	
		});		
	});


	$('#sync').click(function(){
		//�������� ��������
		var dataSync;
		for (var i=0; i<data1;i++){
			//������
			elem = $('p.oper:first');
			dataSync = value_sync();
			console.log(dataSync);
			val = parse(dataSync.responseText);
			//�������� ������ �����
			for (var j=0;j<i;j++)
			{
				elem = elem.next('p.oper');	
			};
			elem.append('<input maxlength="25" size="6" value='+val+'> <button class="save"> ���������</button>');
		};
	});
	
	$('#async').click(function(){
		//�������� ��������
		elem = $('p.oper:first');
		for (var i=0; i<data1;i++){
		//������
			value_async(elem).then(function(data){
				console.log(data);
				console.log ("i= "+i);
				val = parse(data);
				elem.append('<input maxlength="25" size="6" value='+val+'> <button class="save"> ���������</button>');
				//����. ����
				elem = elem.next('p.oper');	
			});
		};
	});
	
	//��������� ���������� �� ������������� ������ .save
	$('body').on('click','.save',function(){
		//�������� ���������
		var n = $(this).parent().attr('id'); //����� ��������� �� ID (<p id="" - �������� <button>-�)
		var p = $(this).prev().val(); //�������� ���������. prev() = <input>
		var e = $(this); //���� ������ .save, ��������������� ���������
		//�������� � �������, ���� �� ��� ������ oper
		save(e,n,p).then(function(data){
			data1 = parse(data);
			console.log(data1);
			//���� ��� - ������� ���� ���� ���������
			if (data1 == "true"){
				e.parent().remove();
			}else {
				e.parent().append('<div class="varn"> ������ �����, ���������� ��� ���</div>');
				setTimeout(function () {
				   //������� �������
				   e.next().remove();
				}, 1000);
			};
			//���� ������ �� ��������			
			if (!$('p').is(".oper")){
				//������� ���-�� ����������;
				$('p').remove();
				//�������� ������ ������
				$('#firstGet').show();
			};
		});	
	});
};

//������ ��� ������� ������ .save
var save = function(elem, nParam, val){
	return $.ajax({
			url: siteAdress+"?act=setValue&operator="+nParam+"&value="+val,
			async: true,
		});
};

//�������� ���������� ����������
var load = function(){
	return $.ajax({
			url: siteAdress+"?act=getOperatorCnt"
	}	);
};

//���������� ������
var value_sync = function(){
	return $.ajax({
			url: siteAdress+"?act=getValue",
			async: false
		});
};

//����������� ������
var value_async = function(elem){
	return $.ajax({
			url: siteAdress+"?act=getValue",
			async: true
		});
};

//������ ������
var parse = function(data){
	var i = 0;
	while (data.charAt(i) != ":"){
		i++;
	};
	return (data.substring(i+1,data.length-1));
};



$(document).ready(main);