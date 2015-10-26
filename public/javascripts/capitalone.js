var access_token = "2250114038.1e58aa4.6cd4987dbf244c41b7ddaedc48a186d7";
var tag_url = "https://api.instagram.com/v1/tags/capitalone/media/recent?access_token=" + access_token;
var next;

// url to query instagram for user information
function getUserUrl(id) {
	return "https://api.instagram.com/v1/users/" + id + "/?access_token=" + access_token;
}

// from stackoverflow, formatting 1000 into 1k
function kFormatter(num) {
    return num > 999 ? (num/1000).toFixed(1) + 'k' : num
}

// formatting the sentiment depending on the value calculated
function sentimentFormatter(clone, score) {
	var sent_div = clone.find('.hover-sentiment');
	if(score < -5) {
		sent_div.addClass('very-neg');
		sent_div.html('<i class="fa-frown-o fa fw"> </i><i class="fa-frown-o fa fw"></i>');
	}
	else if(score < 0) {
		sent_div.addClass('slight-neg');
		sent_div.html('<i class="fa-frown-o fa fw"></i>');
	}
	else if(score === 0) {
		sent_div.addClass('neutral');
		sent_div.html('<i class="fa-meh-o fa fw"></i>');
	}
	else if(score < 5) {
		sent_div.addClass('slight-pos');
		sent_div.html('<i class="fa-smile-o fa fw"></i>');
	}
	else {
		sent_div.addClass('very-pos');
		sent_div.html('<i class="fa-smile-o fa fw"> </i><i class="fa-smile-o fa fw"></i>');
	}

}

// the function that does it all
function getImages(param) {
	var url = tag_url;
	// if they load in more photos, we simply call the function with the added parameter
	if (param != 0) {
		console.log("param in next call", param);
		var param = "&max_tag_id=" + param;
		url += param;
	}
	else {
		console.log("initial");
	}
	console.log("url", url)
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'jsonp',
		success: function(returned) {
			// console.log(returned.data);
			next = returned.pagination.next_max_id;
			// console.log("next", next);
			returned.data.forEach(function(entry) {
				$.ajax({
					url: getUserUrl(entry.user.id),
					type: 'GET',
					dataType: 'jsonp',
					success: function(returned2) {
						var text = entry.caption.text;
						$.ajax({
							url: '/sentiment',
							type: 'GET',
							dataType: 'json',
							contentType: 'application/json',
							data: {"text":text},
							success: function(returned3) {
								// inserting the information into the correct places
								clone = $('.photo-clone').clone();
								clone.removeClass('photo-clone');
								clone.find('.image').attr('src', entry.images.standard_resolution.url);
								clone.find('.user-image').attr('src', entry.user.profile_picture);
								clone.find('.username').text(entry.user.username);
						
								sentimentFormatter(clone, returned3.score);

								var userLink = "https://instagram.com/" + entry.user.username + "/";
								clone.find('.user-link').attr('href', userLink);
								
								var date = new Date(entry.created_time * 1000);
								var date_text = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear().toString().substr(2,2);
								clone.find('.date').text(date_text);
								
								clone.find('.caption').text(entry.caption.text);
								clone.find('.likes-num').text(entry.likes.count);
								
								var media = kFormatter(returned2.data.counts.media);
								var follows = kFormatter(returned2.data.counts.follows);
								var followed_by = kFormatter(returned2.data.counts.followed_by);
								clone.find('.user-info').text(media + " posts | " + followed_by + " followers | " + follows + " following");

								//adding hover transitions
								clone.hover(function() {
									$(this).find('.hover-info').fadeIn(250);
									$(this).find('.hover-sentiment').fadeIn(250);
								}, function() {
									$(this).find('.hover-info').fadeOut(250);
									$(this).find('.hover-sentiment').fadeOut(250);
								});
								
								clone.find('.user-image').hover(function() {
									console.log("???");
									$(this).parent().find('.caption').hide();
									$(this).parent().find('.user-info').fadeIn(250);
								}, function() {
									$(this).parent().find('.user-info').hide();
									$(this).parent().find('.caption').fadeIn(250);
								});

								$('.photo-container').append(clone.show());
							},
							failure: function(returned3) {
								alert("Failure during sentiment analysis.");
							}
						});
					},
					failure: function(returned2) {
						alert("Failure accessing user profile.");
					}
				});
			});
		},
		failure: function(returned) {
			alert("Failure accessing recent posts.");
		}

	});
}

$(document ).ready(function() {	
	getImages(0);

	// set up the buttons
	$('.load-more').click(function() {
		getImages(next);
	});
	$('.text-view').click(function() {
		location.href = "/text";
	});
	$('.about').click(function() {
		location.href = "/about";
	});
});
