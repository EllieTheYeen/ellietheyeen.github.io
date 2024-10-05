---
layout: post
title: Ensure a line is in a file in bash, zsh and sh
date: 2024-10-05 23:05
tags:
- shell
- bash
- zsh
- sh
---
Sometimes you want to ensure a certain line is in a config file for example that there is something in `authorized_keys` or anything like that really. It is quite common to do this manually by opening the file and putting in the line if it is missing and so on. You can however automate the entire process using shell.

* 
{:toc}

I went through a lot of iterations in order to set this up as the compatibilities between shells are not the best. Here you can see the actual result of what I came up wit in order to solve the problem and make a script to ensure that the keys are in the correct location and installed.

```zsh
ensurefileline() {
  file="$1"
  line="$2"
  if [ ! -f "$file" ]; then
    touch "$file"
    echo creating file >&2
    echo "$line" >> "$file"
  else
    echo file exists
    if grep -F "$line" "$file" >/dev/null 2>&1 ; then
     echo line in file >&2
    else
     echo no line in file >&2
     echo "$line" >> "$file"
    fi
  fi
}

keys=$(
cat << 'EOT'
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCLFZusq0Gmyk17xRI0b8vXalKM9cKyjcA6SCSaHoGYHlz39S32zZ7DacDHYx1txiglTEIUVgjzIah2gWcpB7FFvIKoWvfF5VVXhleUjd3y8erRPJ+TuPV5f6po5eUL1iqtTEVrbRmIExzKVPQRSFRuYuCinY6P+wEDm902Kql/aNl9YqPRlc6pnYIvnyXVw2HeyR23noro8GV7CKjBw4PfbWDmH52CYDmvCs0W8xwl27Vg1N97wwMNe93rCqax928nZBdSNipo1bVmL9MhToJgkIMdF73+aNWV4/ug60E79PcB4l6PwnxT2NPASgkcTlugsrkonEfI9xy4OIZt0oD75RQWkbTLU6/di9l8Te/rcQv2UZQEEhU+DesL6nZWRo8YuPbo0WcMcDczXOHq/nsI4vm4rghdR/NotalZxbClpXwAx4tG+mf913fSNHCbnORAUrPMBN9l1XavuVyITvTNRlFCZGNsGXOvH44jpiedU9vSX+kGGofBp+QrDYmjaGs= root@clear
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDLBCvhDnR2oEuFGaLxW+63HYotCt2wIWEB36nXeeuPznoT1TEcBuYT0XsGxA7jzr48X4yHzU38TaHXHAghknMiSNmZpcNxNc49jshj7DyFoeOa84O1cq9An1oVODfOkiQ9Q8k1p4nG+dPnxlBBGXYoINl4qbdZM0NEJM0pXGtXdz5BtGBcL20ZsfJZNHp2jDFtGLxn6TY04wh6KMZ4tHORgVQdMboHKvrUUxtH+s/Y47MAPiwJqbXfCOkZb2dLhrYfV6RhbDZ3Bo3CR3oKtqhBsuBn6HK7FXHHvwzIkuYxt0MowV4/6UO6AIaGC9sFNqkzCyj1diN/rt8UBRC/gNz+2eRsl7pVIt1WBty7XY7Nq9Q5Vo2IjZ/M0k2HY8lLQUxiKzTw1eTYEfqbg9pZzs7ljG9f1ohKcQ1+4WZWh9w52jovdMjB8qvfQLltRyoPEl9xOk3v3+UGCJM0aJTPviGBi+Io0qlNfdzkqCqYzS5ETFCF/PH4cSecokOWALiN0A0= root@clear
EOT
)

OLDIFS="$IFS" # Save IFS in case
export IFS="
" # This looks cursed but does give compatibility with /bin/sh
for key in $( echo "$keys" ); do # This iterates and splits by IFS
ensurefileline ~/.ssh/authorized_keys "$key"
done
IFS="$OLDIFS" # Restore IFS
```

Debugging this entire thing was quite a process as the entire thing inside the function was no problem as it ran no problem inside all shells but some of the other stuff had huge issues. To get exactly the right heredoc syntax was a bit of a pain until I found the `'EOT'` thing that works well and to enclose it all in a command substitution with `$()` in order to get it into a variable.

## First quirk. Newlines in variables

Here we are going to look at some strange quirks in the whole thing.

This is looking very odd but it works in both zsh, sh and bash
```sh
IFS="
"
```
I have no idea if there is a better solution for this.

However there are other syntaxes that work on many shells such as the following
```sh
variable=$'\n'
```

But the result of that code running in all shells is the following

`test.sh`
```sh
# sh
['$\\n']
# zsh
['\n']
# bash
['\n']
```

Here as you can see the content of the variable becomes `$\\n` which is a literal dollar sign, a backslash and the character n where there is supposed to be a newline.

Here is what is used to test that and get that output. To test this set this up to exist in `PATH` as `args`

`args`
```python
import sys

print(sys.argv[1:])
```

Ensure `test.sh` exist with the contents to test and run this in command line
```sh
echo '#' sh
sh test.sh
echo '#' zsh
zsh test.sh
echo '#' bash
bash test.sh  
```

## Second quirk. Zsh not expanding stuff

First to give an idea of this we are going to put that args command before the ensurefileline function call to see what is being outputted and run first like normal to see what it should look like.

```zsh
# sh
['ensurefileline', '/home/pi/.ssh/authorized_keys', 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCLFZusq0Gmyk17xRI0b8vXalKM9cKyjcA6SCSaHoGYHlz39S32zZ7DacDHYx1txiglTEIUVgjzIah2gWcpB7FFvIKoWvfF5VVXhleUjd3y8erRPJ+TuPV5f6po5eUL1iqtTEVrbRmIExzKVPQRSFRuYuCinY6P+wEDm902Kql/aNl9YqPRlc6pnYIvnyXVw2HeyR23noro8GV7CKjBw4PfbWDmH52CYDmvCs0W8xwl27Vg1N97wwMNe93rCqax928nZBdSNipo1bVmL9MhToJgkIMdF73+aNWV4/ug60E79PcB4l6PwnxT2NPASgkcTlugsrkonEfI9xy4OIZt0oD75RQWkbTLU6/di9l8Te/rcQv2UZQEEhU+DesL6nZWRo8YuPbo0WcMcDczXOHq/nsI4vm4rghdR/NotalZxbClpXwAx4tG+mf913fSNHCbnORAUrPMBN9l1XavuVyITvTNRlFCZGNsGXOvH44jpiedU9vSX+kGGofBp+QrDYmjaGs= root@clear']

['ensurefileline', '/home/pi/.ssh/authorized_keys', 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDLBCvhDnR2oEuFGaLxW+63HYotCt2wIWEB36nXeeuPznoT1TEcBuYT0XsGxA7jzr48X4yHzU38TaHXHAghknMiSNmZpcNxNc49jshj7DyFoeOa84O1cq9An1oVODfOkiQ9Q8k1p4nG+dPnxlBBGXYoINl4qbdZM0NEJM0pXGtXdz5BtGBcL20ZsfJZNHp2jDFtGLxn6TY04wh6KMZ4tHORgVQdMboHKvrUUxtH+s/Y47MAPiwJqbXfCOkZb2dLhrYfV6RhbDZ3Bo3CR3oKtqhBsuBn6HK7FXHHvwzIkuYxt0MowV4/6UO6AIaGC9sFNqkzCyj1diN/rt8UBRC/gNz+2eRsl7pVIt1WBty7XY7Nq9Q5Vo2IjZ/M0k2HY8lLQUxiKzTw1eTYEfqbg9pZzs7ljG9f1ohKcQ1+4WZWh9w52jovdMjB8qvfQLltRyoPEl9xOk3v3+UGCJM0aJTPviGBi+Io0qlNfdzkqCqYzS5ETFCF/PH4cSecokOWALiN0A0= root@clear']

# zsh
['ensurefileline', '/home/pi/.ssh/authorized_keys', 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCLFZusq0Gmyk17xRI0b8vXalKM9cKyjcA6SCSaHoGYHlz39S32zZ7DacDHYx1txiglTEIUVgjzIah2gWcpB7FFvIKoWvfF5VVXhleUjd3y8erRPJ+TuPV5f6po5eUL1iqtTEVrbRmIExzKVPQRSFRuYuCinY6P+wEDm902Kql/aNl9YqPRlc6pnYIvnyXVw2HeyR23noro8GV7CKjBw4PfbWDmH52CYDmvCs0W8xwl27Vg1N97wwMNe93rCqax928nZBdSNipo1bVmL9MhToJgkIMdF73+aNWV4/ug60E79PcB4l6PwnxT2NPASgkcTlugsrkonEfI9xy4OIZt0oD75RQWkbTLU6/di9l8Te/rcQv2UZQEEhU+DesL6nZWRo8YuPbo0WcMcDczXOHq/nsI4vm4rghdR/NotalZxbClpXwAx4tG+mf913fSNHCbnORAUrPMBN9l1XavuVyITvTNRlFCZGNsGXOvH44jpiedU9vSX+kGGofBp+QrDYmjaGs= root@clear']

['ensurefileline', '/home/pi/.ssh/authorized_keys', 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDLBCvhDnR2oEuFGaLxW+63HYotCt2wIWEB36nXeeuPznoT1TEcBuYT0XsGxA7jzr48X4yHzU38TaHXHAghknMiSNmZpcNxNc49jshj7DyFoeOa84O1cq9An1oVODfOkiQ9Q8k1p4nG+dPnxlBBGXYoINl4qbdZM0NEJM0pXGtXdz5BtGBcL20ZsfJZNHp2jDFtGLxn6TY04wh6KMZ4tHORgVQdMboHKvrUUxtH+s/Y47MAPiwJqbXfCOkZb2dLhrYfV6RhbDZ3Bo3CR3oKtqhBsuBn6HK7FXHHvwzIkuYxt0MowV4/6UO6AIaGC9sFNqkzCyj1diN/rt8UBRC/gNz+2eRsl7pVIt1WBty7XY7Nq9Q5Vo2IjZ/M0k2HY8lLQUxiKzTw1eTYEfqbg9pZzs7ljG9f1ohKcQ1+4WZWh9w52jovdMjB8qvfQLltRyoPEl9xOk3v3+UGCJM0aJTPviGBi+Io0qlNfdzkqCqYzS5ETFCF/PH4cSecokOWALiN0A0= root@clear']

# bash
['ensurefileline', '/home/pi/.ssh/authorized_keys', 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCLFZusq0Gmyk17xRI0b8vXalKM9cKyjcA6SCSaHoGYHlz39S32zZ7DacDHYx1txiglTEIUVgjzIah2gWcpB7FFvIKoWvfF5VVXhleUjd3y8erRPJ+TuPV5f6po5eUL1iqtTEVrbRmIExzKVPQRSFRuYuCinY6P+wEDm902Kql/aNl9YqPRlc6pnYIvnyXVw2HeyR23noro8GV7CKjBw4PfbWDmH52CYDmvCs0W8xwl27Vg1N97wwMNe93rCqax928nZBdSNipo1bVmL9MhToJgkIMdF73+aNWV4/ug60E79PcB4l6PwnxT2NPASgkcTlugsrkonEfI9xy4OIZt0oD75RQWkbTLU6/di9l8Te/rcQv2UZQEEhU+DesL6nZWRo8YuPbo0WcMcDczXOHq/nsI4vm4rghdR/NotalZxbClpXwAx4tG+mf913fSNHCbnORAUrPMBN9l1XavuVyITvTNRlFCZGNsGXOvH44jpiedU9vSX+kGGofBp+QrDYmjaGs= root@clear']

['ensurefileline', '/home/pi/.ssh/authorized_keys', 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDLBCvhDnR2oEuFGaLxW+63HYotCt2wIWEB36nXeeuPznoT1TEcBuYT0XsGxA7jzr48X4yHzU38TaHXHAghknMiSNmZpcNxNc49jshj7DyFoeOa84O1cq9An1oVODfOkiQ9Q8k1p4nG+dPnxlBBGXYoINl4qbdZM0NEJM0pXGtXdz5BtGBcL20ZsfJZNHp2jDFtGLxn6TY04wh6KMZ4tHORgVQdMboHKvrUUxtH+s/Y47MAPiwJqbXfCOkZb2dLhrYfV6RhbDZ3Bo3CR3oKtqhBsuBn6HK7FXHHvwzIkuYxt0MowV4/6UO6AIaGC9sFNqkzCyj1diN/rt8UBRC/gNz+2eRsl7pVIt1WBty7XY7Nq9Q5Vo2IjZ/M0k2HY8lLQUxiKzTw1eTYEfqbg9pZzs7ljG9f1ohKcQ1+4WZWh9w52jovdMjB8qvfQLltRyoPEl9xOk3v3+UGCJM0aJTPviGBi+Io0qlNfdzkqCqYzS5ETFCF/PH4cSecokOWALiN0A0= root@clear']
```

This looks correct and you know what the function is supposed to be called with but now look at this.

```zsh
# sh
['ensurefileline', '/home/pi/.ssh/authorized_keys', 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCLFZusq0Gmyk17xRI0b8vXalKM9cKyjcA6SCSaHoGYHlz39S32zZ7DacDHYx1txiglTEIUVgjzIah2gWcpB7FFvIKoWvfF5VVXhleUjd3y8erRPJ+TuPV5f6po5eUL1iqtTEVrbRmIExzKVPQRSFRuYuCinY6P+wEDm902Kql/aNl9YqPRlc6pnYIvnyXVw2HeyR23noro8GV7CKjBw4PfbWDmH52CYDmvCs0W8xwl27Vg1N97wwMNe93rCqax928nZBdSNipo1bVmL9MhToJgkIMdF73+aNWV4/ug60E79PcB4l6PwnxT2NPASgkcTlugsrkonEfI9xy4OIZt0oD75RQWkbTLU6/di9l8Te/rcQv2UZQEEhU+DesL6nZWRo8YuPbo0WcMcDczXOHq/nsI4vm4rghdR/NotalZxbClpXwAx4tG+mf913fSNHCbnORAUrPMBN9l1XavuVyITvTNRlFCZGNsGXOvH44jpiedU9vSX+kGGofBp+QrDYmjaGs= root@clear']

['ensurefileline', '/home/pi/.ssh/authorized_keys', 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDLBCvhDnR2oEuFGaLxW+63HYotCt2wIWEB36nXeeuPznoT1TEcBuYT0XsGxA7jzr48X4yHzU38TaHXHAghknMiSNmZpcNxNc49jshj7DyFoeOa84O1cq9An1oVODfOkiQ9Q8k1p4nG+dPnxlBBGXYoINl4qbdZM0NEJM0pXGtXdz5BtGBcL20ZsfJZNHp2jDFtGLxn6TY04wh6KMZ4tHORgVQdMboHKvrUUxtH+s/Y47MAPiwJqbXfCOkZb2dLhrYfV6RhbDZ3Bo3CR3oKtqhBsuBn6HK7FXHHvwzIkuYxt0MowV4/6UO6AIaGC9sFNqkzCyj1diN/rt8UBRC/gNz+2eRsl7pVIt1WBty7XY7Nq9Q5Vo2IjZ/M0k2HY8lLQUxiKzTw1eTYEfqbg9pZzs7ljG9f1ohKcQ1+4WZWh9w52jovdMjB8qvfQLltRyoPEl9xOk3v3+UGCJM0aJTPviGBi+Io0qlNfdzkqCqYzS5ETFCF/PH4cSecokOWALiN0A0= root@clear']

# zsh
['ensurefileline', '/home/pi/.ssh/authorized_keys', 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCLFZusq0Gmyk17xRI0b8vXalKM9cKyjcA6SCSaHoGYHlz39S32zZ7DacDHYx1txiglTEIUVgjzIah2gWcpB7FFvIKoWvfF5VVXhleUjd3y8erRPJ+TuPV5f6po5eUL1iqtTEVrbRmIExzKVPQRSFRuYuCinY6P+wEDm902Kql/aNl9YqPRlc6pnYIvnyXVw2HeyR23noro8GV7CKjBw4PfbWDmH52CYDmvCs0W8xwl27Vg1N97wwMNe93rCqax928nZBdSNipo1bVmL9MhToJgkIMdF73+aNWV4/ug60E79PcB4l6PwnxT2NPASgkcTlugsrkonEfI9xy4OIZt0oD75RQWkbTLU6/di9l8Te/rcQv2UZQEEhU+DesL6nZWRo8YuPbo0WcMcDczXOHq/nsI4vm4rghdR/NotalZxbClpXwAx4tG+mf913fSNHCbnORAUrPMBN9l1XavuVyITvTNRlFCZGNsGXOvH44jpiedU9vSX+kGGofBp+QrDYmjaGs= root@clear\nssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDLBCvhDnR2oEuFGaLxW+63HYotCt2wIWEB36nXeeuPznoT1TEcBuYT0XsGxA7jzr48X4yHzU38TaHXHAghknMiSNmZpcNxNc49jshj7DyFoeOa84O1cq9An1oVODfOkiQ9Q8k1p4nG+dPnxlBBGXYoINl4qbdZM0NEJM0pXGtXdz5BtGBcL20ZsfJZNHp2jDFtGLxn6TY04wh6KMZ4tHORgVQdMboHKvrUUxtH+s/Y47MAPiwJqbXfCOkZb2dLhrYfV6RhbDZ3Bo3CR3oKtqhBsuBn6HK7FXHHvwzIkuYxt0MowV4/6UO6AIaGC9sFNqkzCyj1diN/rt8UBRC/gNz+2eRsl7pVIt1WBty7XY7Nq9Q5Vo2IjZ/M0k2HY8lLQUxiKzTw1eTYEfqbg9pZzs7ljG9f1ohKcQ1+4WZWh9w52jovdMjB8qvfQLltRyoPEl9xOk3v3+UGCJM0aJTPviGBi+Io0qlNfdzkqCqYzS5ETFCF/PH4cSecokOWALiN0A0= root@clear']

# bash
['ensurefileline', '/home/pi/.ssh/authorized_keys', 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCLFZusq0Gmyk17xRI0b8vXalKM9cKyjcA6SCSaHoGYHlz39S32zZ7DacDHYx1txiglTEIUVgjzIah2gWcpB7FFvIKoWvfF5VVXhleUjd3y8erRPJ+TuPV5f6po5eUL1iqtTEVrbRmIExzKVPQRSFRuYuCinY6P+wEDm902Kql/aNl9YqPRlc6pnYIvnyXVw2HeyR23noro8GV7CKjBw4PfbWDmH52CYDmvCs0W8xwl27Vg1N97wwMNe93rCqax928nZBdSNipo1bVmL9MhToJgkIMdF73+aNWV4/ug60E79PcB4l6PwnxT2NPASgkcTlugsrkonEfI9xy4OIZt0oD75RQWkbTLU6/di9l8Te/rcQv2UZQEEhU+DesL6nZWRo8YuPbo0WcMcDczXOHq/nsI4vm4rghdR/NotalZxbClpXwAx4tG+mf913fSNHCbnORAUrPMBN9l1XavuVyITvTNRlFCZGNsGXOvH44jpiedU9vSX+kGGofBp+QrDYmjaGs= root@clear']

['ensurefileline', '/home/pi/.ssh/authorized_keys', 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDLBCvhDnR2oEuFGaLxW+63HYotCt2wIWEB36nXeeuPznoT1TEcBuYT0XsGxA7jzr48X4yHzU38TaHXHAghknMiSNmZpcNxNc49jshj7DyFoeOa84O1cq9An1oVODfOkiQ9Q8k1p4nG+dPnxlBBGXYoINl4qbdZM0NEJM0pXGtXdz5BtGBcL20ZsfJZNHp2jDFtGLxn6TY04wh6KMZ4tHORgVQdMboHKvrUUxtH+s/Y47MAPiwJqbXfCOkZb2dLhrYfV6RhbDZ3Bo3CR3oKtqhBsuBn6HK7FXHHvwzIkuYxt0MowV4/6UO6AIaGC9sFNqkzCyj1diN/rt8UBRC/gNz+2eRsl7pVIt1WBty7XY7Nq9Q5Vo2IjZ/M0k2HY8lLQUxiKzTw1eTYEfqbg9pZzs7ljG9f1ohKcQ1+4WZWh9w52jovdMjB8qvfQLltRyoPEl9xOk3v3+UGCJM0aJTPviGBi+Io0qlNfdzkqCqYzS5ETFCF/PH4cSecokOWALiN0A0= root@clear']
```

Can you see the difference? If you do not see it did not split the content inside the heredoc by newline. The line

```zsh
for key in $( echo "$keys" ); do
```

Was replaced with

```zsh
for key in $keys; do
```

Which looks like it makes sense but this does not function inside zsh for some reason. That reason is zsh splitting does not work like normal and according to [Stack Exchange](https://unix.stackexchange.com/questions/295033/loop-over-a-string-in-zsh-and-bash) in Zsh command expansions are split but not variable expansion.

## Goal

So this goal of the entire this as discussed in the beginning is to be able to change some configs to ensure consistency and such. Lets give another example of usage where we have a file that is `~/.aliases` and we want it sourced and we want to make sure it is sourced but only once on multiple executions of some install script. We create the following code for that.

```zsh
ensurefileline .zshrc "if [ -f ~/.aliases ]; then source ~/.aliases fi"
ensurefileline .bashrc "if [ -f ~/.aliases ]; then . ~/.aliases fi"
```

This can then be run any number of times and only if the line is missing it will be added to the file. Another thing to note is that the `grep` command must be called with the `-F` flag that uses a fixed string as otherwise we would have to escape it somehow. Try this out if you want and have fun
