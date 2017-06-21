# DOCKER LOAD BALANCER PATTERN

## CONCEPTION
```
                        +------------------+             +------------------+
                        | Load balancer 1  +-----------> | WEB 1            |
                   +--> | NGINX            +---+         | APACHE2          |
                   |    |                  |   |  +----> |                  |
+-------------+    |    |                  |   |  |      |                  |
|             +----+    +------------------+   |  |      +------------------+
|  HAPROXY    |                                |  |
|             +----+                           |  |
|             |    |    +------------------+   |  |      +------------------+
+-------------+    |    | Load balancer 2  |   +-------> | WEB 2            |
                   |    | NGINX            |      |      | APACHE2          |
                   +--> |                  +------+      |                  |
                        |                  +-----------> |                  |
                        +------------------+             +------------------+
```
## DESIGN PATTERN
Two web apache running with exposed volumes
- web1 : web1/volume/www/html - exposed port 8881:80
- web2 : web1/volume/www/html - exposed port 8882:80

Two load balancer watching at two previous web apache
- lb1: exposed ports: 6884:80 -p 6883:443
- lb2: exposed ports: 7884:80 -p 7883:443

One haproxy watching for previous two load balancer
- hap: exposed port:  8884:5000

Sources : 
https://www.digitalocean.com/community/tutorials/how-to-create-a-high-availability-haproxy-setup-with-corosync-pacemaker-and-floating-ips-on-ubuntu-14-04
- docker apache               : eboraas/apache
- docker load balancer nginx  : hitsteam/nginx-load-balancer
- docker haproxy              : eeacms/haproxy 


## INSTALL MANUAL

1. Requirements : 
    - docker installed
    - edjanger installed (https://github.com/pamtrak06/edjanger.git)
2. Download source : git clone https://github.com/pamtrak06/load-balancer.git
```
.
  |-web1		=> apache2 server 1
  |  |-volume
  |  |  |-www
  |  |  |  |-html
  |  |  |  |  |-data
  |  |  |-log
  |-web2		=> apache2 server 2
  |  |-volume
  |  |  |-www
  |  |  |  |-html
  |  |  |  |  |-data
  |  |  |-log
  |-hb			=> heartbeat (Work In Progress)
  |-lb1			=> nginx load balancer 1
  |  |-build
  |  |-volume
  |  |  |-nginx
  |  |  |  |-certs
  |  |  |  |-conf.d
  |  |  |  |-sites-enabled
  |  |  |-log
  |-lb2			=> nginx load balancer 2
  |  |-build
  |  |-volume
  |  |  |-nginx
  |  |  |  |-certs
  |  |  |  |-conf.d
  |  |  |  |-sites-enabled
  |  |  |-log
  |-hap			=> HaProxy
  |  |-volume
  |  |  |-haproxy
  |  |  |  |-haproxy.cfg
  |-data		=> shared volume (/var/www/html/data) by web1 & web2
  |  |-build
  |  |-volume
  |  |  |-data
```
3. Run containers:
./run.sh

## Tests
```
- web1:    http://192.168.99.100:8881/
- web2:    http://192.168.99.100:8882/
- lb1:     http://192.168.99.100:6884/
- lb2:     http://192.168.99.100:7884/
- haproxy: http://192.168.99.100:8884/
```
Steps:
- show exposed apache in hap
- stop it : docker stop lb1apache_1 or lb1apache_2
- show exposed apache in hap and other load balancer
- start it : docker stop lb1apache_1 or lb1apache_2
