crontab -l > mycron


echo '0 */3 * * * rm /run/lock/ljopi_discord_bot_lockfile' >> mycron

crontab mycron

rm mycron
