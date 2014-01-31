Seng515PetroleumExplorer.Router.map(function () {
  
  this.resource('oilwells', function(){
    this.resource('oilwell', { path: '/:oilwell_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });
  
});
