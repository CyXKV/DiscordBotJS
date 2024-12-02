const isLink = function isLink(url) {
	if(url === undefined) {
		return false;
	}
		return true;
}

const isInChannel = function isInChannel(channel){
	if(!channel){
		return false;
	}
	return true;
}

const isDuration = function isDuration(duration){
	if(duration/1000 > 600){
		return true;
	}
	return false;
}
export {isLink, isInChannel, isDuration};

