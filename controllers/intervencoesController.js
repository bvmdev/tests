"USE STRICT";
app.controller("intervencoesController", function($scope, $location, dbService){

	$scope.init = function(){
		dbService.runAsync("SELECT combo FROM sistemas", function(data){
			$scope.sistema = data;								
		});
		dbService.runAsync("SELECT status FROM status", function(data){
			$scope.status = data;								
		});
	}

	//$scope.status = ["TO DO", "DOING", "WAITING", "DONE"];
	
	//Listando
	$scope.lista = function(){
		dbService.runAsync("SELECT * FROM intervencoes", function(data){
			$scope.interv = data;
		});
	}

	//Salvando
	$scope.salvar = function(){
		if($scope.int.id){
			//Editar
		
			var id = $scope.int.id;
			delete $scope.int.id;
			delete $scope.int.$$hashKey; //Apaga elemento $$hashKey do objeto
			dbService.update('intervencoes', $scope.int, {id: id}); //entidade, dados, where
		}else{
			//nova
			dbService.insert('intervencoes', $scope.int); // entidade, dados
		}
		$scope.interv = {};
		$scope.lista();
		$('#modalInterv').modal('hide');
	}

	//Abrindo para editar
	$scope.editar = function(dados){
		$scope.int = dados;
		$('#modalInterv').modal('show');
	}


	$scope.showDescricao = function(dados){
		$scope.int = dados;
		dbService.runAsync("SELECT * FROM log where id_intervencao = "+ dados.id + " order by data desc", function(data){
			$scope.intervLog = data;		
		});
		$('#modalIntervDesc').modal('show');
	}

	//Abrindo LOG
	$scope.inserirLogs = function(dados){	
		$scope.int = dados;
		$scope.intLog = {"data":"", "log":"", "id_intervencao" : dados.id };
		$('#modalIntervLog').modal('show');
	}

	$scope.inserirLog = function(dados){		
		dbService.insert('log', dados); // entidade, dados
		$('#modalIntervLog').modal('hide');
	}

//Excluindo
$scope.excluirLog = function(dados){
	if(confirm("Deseja realmente apagar o log ?")){
		//dbService.delete('intervencoes', {id: dados.id});
		dbService.run("DELETE FROM log WHERE id = ?;",[dados.id]);
		dbService.runAsync("SELECT * FROM log where id_intervencao = "+ dados.id_intervencao + " order by data desc", function(data){
			$scope.intervLog = data;			
		});
	}
}
	//Excluindo
	$scope.excluir = function(dados){
		if(confirm("Deseja realmente apagar o cadastro de "+dados.id+"?")){
			//dbService.delete('intervencoes', {id: dados.id});
			dbService.run("DELETE FROM intervencoes WHERE id = ?;",[dados.id]);
			$scope.lista();
		}		
	}

	$scope.$on('$viewContentLoaded', function() {
		$scope.init();
	});
});