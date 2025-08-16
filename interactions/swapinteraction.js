export async function swapMembers(member, channel, count) {
		for(let i = 0; i < count; i++) {
				await member.voice.setChannel(member.guild.channels.cache.get("1257988317086224426"));

				 console.log(`Перемещён в ${member.guild.channels.cache.get("1257988317086224426").name}`);
				 
				await sleep(500);		
	
				await member.voice.setChannel(member.guild.channels.cache.get("1405931422040064141"));

				 console.log(`Перемещён в ${member.guild.channels.cache.get("1405931422040064141").name}`);

				await sleep(500);

				if(i == count-1){
					await member.voice.setChannel(channel);
				}
			}
	}

	function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
	}