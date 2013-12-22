function randomFiles(){
	var lorem = rndFrom('lorem,ipsum,dolor,sit,amet,consectetur,adipiscing,elit,ut,aliquam,purus,amet,luctus,venenatis,lectus,magna,fringilla,urna,porttitor,rhoncus,non,enim,praesent,elementum,facilisis,leo,vel,est,ullamcorper,eget,nulla,facilisi,etiam,dignissim,diam,quis,lobortis,scelerisque,fermentum,dui,faucibus,in,ornare,quam,viverra,orci,sagittis,eu,volutpat,odio,mauris,massa,vitae,tortor,condimentum,lacinia,eros,donec,ac,tempor,dapibus,ultrices,iaculis,nunc,sed,augue,lacus,congue,eu,consequat,felis,et,pellentesque,commodo,egestas,phasellus,eleifend,pretium,vulputate,sapien,nec,aliquam,malesuada,bibendum,arcu,curabitur,velit,sodales,sem,integer,justo,vestibulum,risus,ultricies,tristique,aliquet,tortor,at,auctor,urna,id,cursus,metus,mi,posuere,sollicitudin,orci,a,semper,duis,tellus,mattis,nibh,proin,nisl,venenatis,a,habitant,morbi,senectus,netus,fames,turpis,tempus,pharetra,pharetra,mi,hendrerit,gravida,blandit,hac,habitasse,platea,dictumst,quisque,sagittis,consequat,nisi,suscipit,maecenas,cras,aenean,placerat,vestibulum,eros,tincidunt,erat,imperdiet,euismod,nisi,porta,mollis,leo,nisl,ipsum,nec,nullam,feugiat,fusce,suspendisse,potenti,vivamus,dictum,varius,sapien,molestie,ac,massa,accumsan,vitae,arcu,vel,dolor,enim,neque,convallis,neque,tempus,nam,pulvinar,laoreet,interdum,libero,est,tempor,elementum,nunc,risus,cum,sociis,natoque,penatibus,magnis,dis,parturient,montes,nascetur,ridiculus,mus,accumsan,lacus,volutpat,dui,ligula,libero,justo,diam,rhoncus,felis,et,mauris,ante,metus,commodo,velit,non,tellus,purus,rutrum,fermentum,pretium,elit,vehicula'.split(','))
		,type = rndFrom('jpg,jpeg,png,gif,txt,as,md,js,html,xml,'.split(','))
		,aFiles = []
	;
	for (var i=0;i<23;i++) {
		var sType = type()
			,sName = lorem()
			,sFile = sName+'.'+sType
			,iTime = Math.random()*1.4E12<<0
		;
		aFiles.push({
			 name: sFile
			,path: 'data/'+sFile
			,type: sType
			,size: Math.random()*1E4<<0
			,time: iTime
			,date: new Date(iTime)
		});
	}
	function rndFrom(a){
		var i = a.length;
		return function(){
			return a[Math.random()*i<<0]
		}
	}
	return aFiles;
}