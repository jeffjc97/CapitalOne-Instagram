var access_token = "2250114038.1e58aa4.6cd4987dbf244c41b7ddaedc48a186d7";
var tag_url = "https://api.instagram.com/v1/tags/capitalone/media/recent?access_token=" + access_token;
var next;
var num_positive = 0;
var num_negative = 0;
var num_neutral = 0;

function getUserUrl(id) {
	return "https://api.instagram.com/v1/users/" + id + "/?access_token=" + access_token;
}

// from stackoverflow
function kFormatter(num) {
    return num > 999 ? (num/1000).toFixed(1) + 'k' : num;
}

function sentimentFormatter(clone, score) {
	var sent_div = clone.find('.sentiment');
	sent_div.text(score);

	if(score < -5) {
		sent_div.addClass('very-neg');
		num_negative += 1;
	}
	else if(score < 0) {
		sent_div.addClass('slight-neg');
		num_negative += 1;
	}
	else if(score === 0) {
		sent_div.addClass('neutral');
		num_neutral += 1;
	}
	else if(score < 5) {
		sent_div.addClass('slight-pos');
		num_positive += 1;
	}
	else {
		sent_div.addClass('very-pos');
		num_positive += 1;
	}

}

function getInfo(param) {
	var url = tag_url;
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
			console.log(returned.data);
			var length = returned.data.length
			var count = 0;
			// console.log(returned.data[returned.data.length -1].id);
			next = returned.pagination.next_max_id;
			console.log("next", next);
			returned.data.forEach(function(entry) {
				count += 1;
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
							// data: JSON.stringify({'text': text}),
							data: {"text":text},
							success: function(returned3) {
								clone = $('.row-clone').clone();
								clone.removeClass('row-clone');
								clone.find('.username').text(entry.user.username);
								var userLink = "https://instagram.com/" + entry.user.username + "/";
								clone.find('.username').attr('href', userLink);


								var media = kFormatter(returned2.data.counts.media);
								var follows = kFormatter(returned2.data.counts.follows);
								var followed_by = kFormatter(returned2.data.counts.followed_by);

								clone.find('.user-posts').text(media);
								clone.find('.followers').text(followed_by);
								clone.find('.following').text(follows);


								clone.find('.post-link').html('<a href="' + entry.link +'" target="_blank">Link</a>');
								
								var date = new Date(entry.created_time * 1000);
								var date_text = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear().toString().substr(2,2);
								clone.find('.post-date').text(date_text);

								clone.find('.post-likes').text(entry.likes.count);

								clone.find('.positive').text(returned3.positive.join(", "));
								clone.find('.negative').text(returned3.negative.join(", "));
								sentimentFormatter(clone, returned3.score);
								if(count == length) {
									$('.sentiment-overview').text("Positive Posts: " + num_positive + " | " + "Neutral Posts: " + num_neutral + " | " + "Negative Posts: " + num_negative);
								}
								// var userLink = "https://instagram.com/" + entry.user.username + "/";

								$('.info-table-body').append(clone.show());
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
	getInfo(0);

	$('.load-more').click(function() {
		getInfo(next);
	});
	$('.text-view').click(function() {
		location.href = "/";
	});
	$('.about').click(function() {
		location.href = "/about";
	});
});