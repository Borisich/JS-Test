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
			//Получили данные. Скрываем кнопку, выводим строку, добавляем 2 кнопки и список. Данные - в data1
			console.log("data1="+data1);
			//убираем кнопку
			currentButton.hide();
			//выводим строку
			$('body').append('<p>Кол-во операторов: '+data1+'</p>');
			//показать 2 кнопки
			$('#sync, #async').show();
			//строим список
			for (var i=0; i<(data1); i++){
				$('body').append('<p class="oper" id="'+(i+1)+'">Оператор №['+(i+1)+']: </p>');
			}	
		});		
	});


	$('#sync').click(function(){
		//получаем значения
		var dataSync;
		for (var i=0; i<data1;i++){
			//запрос
			elem = $('p.oper:first');
			dataSync = value_sync();
			console.log(dataSync);
			val = parse(dataSync.responseText);
			//выбираем нужный абзац
			for (var j=0;j<i;j++)
			{
				elem = elem.next('p.oper');	
			};
			elem.append('<input maxlength="25" size="6" value='+val+'> <button class="save"> Сохранить</button>');
		};
	});
	
	$('#async').click(function(){
		//получаем значения
		elem = $('p.oper:first');
		for (var i=0; i<data1;i++){
		//запрос
			value_async(elem).then(function(data){
				console.log(data);
				console.log ("i= "+i);
				val = parse(data);
				elem.append('<input maxlength="25" size="6" value='+val+'> <button class="save"> Сохранить</button>');
				//след. элем
				elem = elem.next('p.oper');	
			});
		};
	});
	
	//назначаем обработчик на новосозданные кнопки .save
	$('body').on('click','.save',function(){
		//получаем параметры
		var n = $(this).parent().attr('id'); //Номер оператора по ID (<p id="" - родитель <button>-а)
		var p = $(this).prev().val(); //Значение оператора. prev() = <input>
		var e = $(this); //сама кнопка .save, соответствующая оператору
		//засылаем и смотрим, есть ли еще абзацы oper
		save(e,n,p).then(function(data){
			data1 = parse(data);
			console.log(data1);
			//если тру - удалить весь блок оператора
			if (data1 == "true"){
				e.parent().remove();
			}else {
				e.parent().append('<div class="varn"> сервер занят, попробуйте еще раз</div>');
				setTimeout(function () {
				   //удаляем надпись
				   e.next().remove();
				}, 1000);
			};
			//если ничего не осталось			
			if (!$('p').is(".oper")){
				//удалить кол-во операторов;
				$('p').remove();
				//показать первую кнопку
				$('#firstGet').show();
			};
		});	
	});
};

//Запрос при нажатии кнопки .save
var save = function(elem, nParam, val){
	return $.ajax({
			url: siteAdress+"?act=setValue&operator="+nParam+"&value="+val,
			async: true,
		});
};

//Загрузка количества операторов
var load = function(){
	return $.ajax({
			url: siteAdress+"?act=getOperatorCnt"
	}	);
};

//Синхронный запрос
var value_sync = function(){
	return $.ajax({
			url: siteAdress+"?act=getValue",
			async: false
		});
};

//Асинхронный запрос
var value_async = function(elem){
	return $.ajax({
			url: siteAdress+"?act=getValue",
			async: true
		});
};

//Разбор ответа
var parse = function(data){
	var i = 0;
	while (data.charAt(i) != ":"){
		i++;
	};
	return (data.substring(i+1,data.length-1));
};



$(document).ready(main);