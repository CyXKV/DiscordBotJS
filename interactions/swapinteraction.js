export async function swapMembers(member, channel, count) {
		for(let i = 0; i < count; i++) {
				await member.voice.setChannel(member.guild.channels.cache.get("1257988317086224426"));

				await sleep(500);
	
				await member.voice.setChannel(member.guild.channels.cache.get("1405931422040064141"));

				 console.log(member.nickname + " перекинут ${i+1}" + " раз(а) из " + count);

				await sleep(500);

				if(i == count-1){
					await member.voice.setChannel(channel);
				}
			}
	}

	function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
	}