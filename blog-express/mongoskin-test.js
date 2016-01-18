var mongoskin = require('mongoskin'),
	dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/local',
	db = mongoskin.db(dbUrl, {safe: true})

db.bind('messages').bind({
  findOneAndAddText : function (text, fn) {
    db.collection('messages').findOne({text : text}, function(error, item){
      if (error) {
        console.error(error);
        process.exit(1);
      }
      
      if (item == null) {
    	db.collection('messages').insert({text: text, state: true}, function(err, result) {
    	    if (err) throw err;
    	    if (result) console.log('Added!');
    	});
    	
    	db.messages.findOneAndAddText(text, fn);
      } else {
    	  console.info("findOne: ", item);
          return fn();
      }
    })
  }
});

db.messages.findOneAndAddText('hahahaha', function(){
    db.collection('messages').find({}).toArray(function(error, items){
    	console.log(items);
    	
    	db.close();
    	process.exit(0);
    });
});