var myBtn = document.getElementsByClassName('my-btn');

for(var i = 0; i < myBtn.length; i++) {
	var btn = myBtn[i];
	btn.addEventListener('click', function (event) {
		var self = this;
		var rect = this.getBoundingClientRect();
		var diameter = Math.max(rect.width, rect.height);

		var span = this.querySelector('.wave');
		if (!span) {
			span = document.createElement('span');
			span.className = 'wave';
			span.style.height = diameter + 'px';
			span.style.width = diameter + 'px';
			this.appendChild(span);
		}
		span.classList.remove('anim');
		span.style.left = event.clientX - rect.left - diameter / 2 + 'px';
		span.style.top = event.clientY - rect.top - diameter / 2 + 'px';
		// span.classList.add('anim');
		setTimeout(function () {
			span.classList.add('anim');
		}, 0);
	});
}