$('.card').click(function (e) {
    let id = e.currentTarget.id;
    if(e.target.classList[0]!='remove-from-bookmarks')
    window.location.href = "/posts/" + id;
});

$('.card').click(function (e) {
    let id = e.currentTarget.id;
    if (e.target.classList[0] == 'remove-from-bookmarks')
        $(this).css('display', 'none');
});
$('a.remove_bookmarks_link').click(function(event) {
    // alert('hii')
    event.preventDefault(); // prevent the default behavior of the anchor tag
    
    var url = $(this).data('href'); // get the URL from the data-href attribute of the anchor tag
    
    swal({
        title: "Are you sure?",
        text: "Do you want to remove from bookmarks?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            url="http://localhost:3000"+ url

    //    alert(url)
        swal("Poof! Bookmark is removed!", {
                        icon: "success",
        });
          window.location.href = url;
          
          
        } else {
          swal("Bookmark is not removed!");
        }
      });

  });


