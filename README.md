# Migration du frontend REFLEX

## 1. Analyse du front FLEX


## 2. Etude du marché ESRI (frameworks)

- [github esri](https://github.com/esri)

## 3. Prototypes

### 3.1 Prototypage frontend

#### a. Dashboard

- [Evaluation ng2-admin](https://github.com/akveo/ng2-admin)

#### b. cartographie

- Prototypes avec librairies js esri : http://172.25.252.192:8881/
- [Angular esri map](https://esri.github.io/angular-esri-map/#/home)
- [https://github.com/tomwayson/esri-angular-cli-example](Example of how to to use the ArcGIS API for JavaScript in an Angular CLI app )
 
### 3.2 Prototypage backend

- migration vers spring version supérieure ou springboot
- mise en oeuvre architecture REST
- mise en oeuvre SSO
- mise en oeuvre HTTPS/certificats


## 4. Ateliers fonctionnels


## 5. Architecture proposée

### Frontend

- framework web : React, Angular 4 ?
- outil de gestion de modules : [webpack](http://webpack.github.io/docs/), SystemJS, none ?
- outil de gestion de dépendances (modules/version) : npm, [yarn](https://yarnpkg.com/fr/) ?
- outils de dev/build : [angular-cli](https://github.com/angular/angular-cli) ?
- JS preprocessor: Babel, TypeScript, none
- CSS preprocessor: Sass, Less, none
- autres outils : yeoman, bower, grunt, browserify ?
- librairies tierces :
    - [redux; Redux is a predictable state container for JavaScript apps.](http://redux.js.org/) ?
    - [flux: guideline for frameworks MV*](http://facebook.github.io/flux/) ?
- middleware de dépoiement: nodejs ?

Documentation

- [Arcgis javascript framework](https://developers.arcgis.com/javascript/latest/guide/using-frameworks/index.html)
- [10 Angular 2 Modules and Tools you need to learn in 2017](http://www.discoversdk.com/blog/10-angular-2-modules-and-tools-you-need-to-learn-in-2017)
- [The fountain](http://fountainjs.io/doc/usage/)


### Backend
- dockerisation des composants ?

- migration Java EE, plusieurs solutions ?
    - mise à jour de la version de spring ?
    - mise à jour de la version de spring + passage à Java EE 7 ?
    - migration de spring à springboot  + passage à Java EE 7 ?

- migration JBoss
    - passage de as 7 à wildfly ?
    - migration vers springboot (Tomcat embeded) ?
    - migration vers glassfish ?

IDE

Spring Initializr at start.spring.io webservice and using Spring Tool Suite

Documentation

- [Updating to Java EE 7](https://developer.ibm.com/wasdev/docs/updating-java-ee-7/)
- [Migrating to Java Platform, Enterprise Edition 7](https://www.ibm.com/support/knowledgecenter/SSEQTP_9.0.0/com.ibm.websphere.base.doc/ae/tovr_migrating_javaee.html)
- [Déployer une application spring boot dans JBoss](https://spring.io/blog/2014/03/07/deploying-spring-boot-applications)

## 6. Etapes de migrations et chiffrage

Postes de réalisation
- migration du backend et du frontend
- tests de non régression
- déploiement: doc de procédure de migration + planning
- mise à jour de la documentation

## 7. Annexes

- [EXTERNALISEZ LA CONFIGURATION DE VOS WEBAPPS SPRING](http://blog.xebia.fr/2012/03/30/externalisez-la-configuration-de-vos-webapps-spring-et-sauvez-un-chaton/)
- [Angular in Production](http://blog.mgechev.com/2017/01/17/angular-in-production/)
- [Spring Petclinic community](https://github.com/spring-petclinic)
- [https://stormpath.com/blog/spring-boot-migration](How We Migrated Our Backend to Spring Boot in 3 Weeks)
- [Superpower Angular Logging with Elasticsearch, Logstash and Kibana — Part 1](https://blog.donkeycode.com/superpower-angular-logging-with-elasticsearch-logstash-and-kibana-part-1-cfb612da4b87)
- 
https://gitlab.akka.eu/cds/technical-papers/blob/develop/user-manuals/angular2/FrameworkUINg2/FrameworkUINg2.pdf
