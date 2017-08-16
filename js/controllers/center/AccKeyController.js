angular.module('FogApp').controller('AccKeyController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$scope.totalItems=0;
	$scope.ListArr =[];
	$scope.maxSize = 5;
	$scope.currentPage = 1;
	$scope.pageSize = 10;

	function InitPage(currentPage){		
		return param={
			'page':currentPage,
			'limit':$scope.pageSize
		}
	}

	var param=InitPage(1);

	/************************初始化数据************************/
	/*Acc列表*/
	var GetListFun=function(param){
		var Url = $rootScope.settings.portsPath+'oauth2/accessKey/?page='+param.page+'&limit='+param.limit;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.totalItems=response.data.count;
				$scope.ListArr = response.data.results;
				for(var i=0;i<$scope.ListArr.length;i++){
					$scope.ListArr[i].showflag=true;
				}
			}else{
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	GetListFun(param);

	/************************页面调用方法************************/
	$scope.ClearForm=function(){/*弹框-清空*/
		$scope.AddName="";
	}

	$scope.ShowList=function(ID,flag){
		for(var i=0;i<$scope.ListArr.length;i++){
			if($scope.ListArr[i].id==ID){
				if(flag==1){
					$scope.ListArr[i].showflag=false;
				}else{
					$scope.ListArr[i].showflag=true;
				}
			}
		}
	}

	$scope.AddMemberFun=function(){
		var Url = $rootScope.settings.portsPath+'oauth2/accessKey/';
		var Data = {
			'name':$scope.AddName
		};
		var PostParam = {
			method: 'POST',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		Common.confirm({
			title: "添加Access Key",
			message: "确认添加Access Key？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "添加成功！",
								operate: function (reselt) {	
									$("#myModal_parameter_btn").click();
									$scope.ReloadFun();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"添加失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "添加失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.DeleteMemberFun=function(ID){
		var Url = $rootScope.settings.portsPath+'oauth2/accessKey/'+ID+'/';
		var Data = '';
		var PostParam = {
			method: 'DELETE',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		Common.confirm({
			title: "Access Key删除",
			message: "确认删除该Access Key？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "删除成功！",
								operate: function (reselt) {	
									$scope.ReloadFun();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"删除失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "删除失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}
			}
		})
	}	

	$scope.pageChanged = function()/*Fun-分页*/
	{
		param=InitPage($scope.currentPage);
		GetListFun(param);
	};


	$scope.ReloadFun=function(){//刷新页面
		param=InitPage(1);
		GetListFun(param);
	}
}]);
