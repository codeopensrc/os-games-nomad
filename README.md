[![Gitlab pipeline status (self-hosted)](https://img.shields.io/gitlab/pipeline/os/games/nomad/master?gitlab_url=https%3A%2F%2Fgitlab.codeopensrc.com&label=CI%2FCD&logo=Azure%20Pipelines)](https://gitlab.codeopensrc.com/os/games/nomad/-/pipelines)
&nbsp; &nbsp; &nbsp;
[![GitLab tag (custom instance)](https://img.shields.io/gitlab/v/tag/os/games/nomad?gitlab_url=https%3A%2F%2Fgitlab.codeopensrc.com&include_prereleases&label=Latest%20Release&logo=Gitlab)](https://gitlab.codeopensrc.com/os/games/nomad/-/tags)
&nbsp; &nbsp; &nbsp;
[![GitHub last commit](https://img.shields.io/github/last-commit/codeopensrc/os-games-nomad?label=Last%20Commit&logo=Git)](https://gitlab.codeopensrc.com/os/games/nomad/-/commits/master)
&nbsp; &nbsp; &nbsp;
[![Docker](https://img.shields.io/badge/Image-latest-blue?logo=Docker)](https://gitlab.codeopensrc.com/os/games/nomad/container_registry/14)


### Running
- Using [docker compose](#running-with-docker-compose)  
- Using [helm](#running-with-helm)  
#### Running with `docker compose`
Fastest and easiest way to run is using docker and `docker compose`  
**[Docker Engine](https://docs.docker.com/engine/installation)**  

- Create a directory and `cd` into it:  
`mkdir nomad && cd nomad`  
- Download the `docker-compose.yml` file:  
`curl -O https://gitlab.codeopensrc.com/os/games/nomad/-/raw/master/docker-compose.yml`  
- Create an empty `.env.tmpl` file:  
`touch .env.tmpl`  
- Pull Image:  
`docker compose pull main`  
- And run:  
`docker compose up main [-d]`  
- Project will be available at `localhost:7000` (main default)  

#### Running with `helm`

To run in a kubernetes environment, use helm.  
**[Install Helm](https://helm.sh/docs/intro/install/)**  
**[Helm quickstart guide](https://helm.sh/docs/intro/quickstart/)**  

If you have a kubernetes environment ready and helm installed -

Method 1)  
Using the remote chart repository.
- Add the chart repository:  
`helm repo add os https://gitlab.codeopensrc.com/api/v4/projects/20/packages/helm/stable`  
- Install the chart:  
`helm upgrade --install react os/nomad`  
- Port-foward a local port (here we use `5000`) to the `nomad-app` service:  
`kubectl port-forward service/nomad-app 5000:80`  
-   Project will be available at `localhost:5000`  

Method 2)  
Cloning and using the local chart.
- Clone the repository:  
`git clone https://gitlab.codeopensrc.com/os/games/nomad.git`  
- Build the chart dependencies:  
`helm dependency build nomad/charts/nomad`
- (Optional) Add/modify values in the `values.yaml` file:  
`vi nomad/charts/nomad/values.yaml`  
  - See [`react-template/charts/tpl/values.yaml`](https://github.com/codeopensrc/os-react-template/blob/master/charts/tpl/values.yaml) for full list of values
- Install the chart:  
`helm upgrade --install nomad nomad/charts/nomad`  
- Port-foward a local port (here we use `5000`) to the `nomad-app` service:  
`kubectl port-forward service/nomad-app 5000:80`  
- Project will be available at `localhost:5000`  

TODO: ingress section  
For using with a resolvable hostname see [ingress](#ingress)  

---

### Development  
- Using [docker compose](#developing-with-docker-compose) 
- TODO: Using [skaffold, helm, and minikube/k8s cluster](#todo-developing-with-skaffold)
#### Developing with `docker compose`
1) Clone  and change into project directory  
`git clone https://gitlab.codeopensrc.com/os/games/nomad.git`  
`cd nomad`  
1) Edit the `dev` service in `docker-compose.yml` to suit your needs   
    A) (optional) Create .env file from template.  
    `cp .env.tmpl .env`  
    B) If using windows then 2a. is not optional and both of the following uncommented and modified
    ```bash
    COMPOSE_CONVERT_WINDOWS_PATHS=1  
    FOLDER_LOCATION=/ABSOLUTE/PATH/TO/WINDOWS/FOLDER/nomad
    ```
1) Build it  
`docker compose build dev`  
1) Run it (`-d` for detached):  
`docker compose up dev [-d]`  
1) Project will be available at `localhost:7005` (dev default)  
1) Run webpack inside the container. (Another terminal if not using `-d`):  
`docker exec CONTAINER_NAME npm run watch`  
1) Modify files in `src/*` and `server/*`  
1) See changes (after page refresh) at `localhost:7005`  


### Hot Reloading

Enable hot reloading (component updates without page refresh) for react components by adjusting a step and using a different port.

- Replace the command in #6 from above  
 `docker exec CONTAINER_NAME npm run watch`  
to  
`docker exec -it CONTAINER_NAME npm run reloader`  
The `-it` allows Ctrl+c to stop the `webpack-dev-server` started inside of the container.  

- Instead of loading `localhost:7005`, load `localhost:7055`  
See ports in `docker-compose.yml` and `src/config/webpack.config.js` to adjust.  

Now with `:7055` loaded in the browser, when you update a react component you can see the page re-render it. The component should keep its state and will not re-run `componentDidMount`/`useEffect` functions.  


### Database

By default the database will not start and connect without editing `docker-compose.yml`.  
- Under `environment` for the `dev` service, change  
`ENABLE_DB: "false"` to `ENABLE_DB: "true"`  

- Uncomment the following lines in `docker-compose.yml`  
```yaml
        #depends_on:
        #    - mongodb
```
to
```yaml
        depends_on:
            - mongodb
```

Now when `docker-compose up dev` is run, a mongodb image will be pulled, start, and the server will connect to it using the `DEV_DATABASE_URL_ORIGIN/MONGO_DB_NAME` connection string.  

---

#### TODO Developing with `skaffold`



---

### Source
Development being done using a self-hosted GitLab instance.  
**[GitLab](https://gitlab.codeopensrc.com/os/games/nomad)**  
**[GitHub Mirror](https://github.com/codeopensrc/os-games-nomad)**  

Feel free to [open issues on GitHub](https://github.com/codeopensrc/os-games-nomad/issues)

---

### License

Nomad Idle is source-available software. You are welcome to view, download, fork, modify, and run the source code for private, noncommercial purposes.
Important: Public Source Does Not Mean Public Use

This repository is publicly visible so that people can read and inspect the source code.

The fact that this repository is public - and that GitHub or another hosting platform may technically allow you to clone or fork it - does not mean that you have permission to publicly distribute, publicly host, sell, or commercially exploit the game.

Your rights are determined by the license in LICENSE, not simply by what the repository hosting platform technically allows you to do.

In other words:

    You may fork this repository for private use. You may not publicly deploy or distribute that fork without permission.

A public GitHub fork is still subject to the restrictions in the license.
What You're Allowed To Do

You may:

    View and study the source code.

    Download the software for personal use.

    Fork the repository for private use.

    Modify the source code for private use.

    Run your own modified version privately.

    Run a private server for yourself and a limited group of personally invited friends.

    Experiment with the game and create private modifications.

A private server does not have to be physically disconnected from the Internet. It can be hosted on an Internet-connected server as long as access remains limited to a small, specifically invited group and the server is not publicly advertised or generally accessible.
What You're Not Allowed To Do

Without explicit written permission from Casey Jones, you may not:

    Sell the game or a modified version.

    Use the game commercially.

    Publicly distribute the game or a modified version.

    Publish a fork for others to download.

    Host a publicly accessible version of the game.

    Launch a competing public server or game service based on the game.

    Offer the game or a modified version as a service to the public.

    Put the game in an app store, public software repository, package registry, or similar distribution platform.

    Use the game's name, branding, artwork, or other identifying materials to imply that an unofficial version is official.

Examples
Use	Allowed?
Read the source on GitHub	✅ Yes
Clone the repository to your computer	✅ Yes
Fork the repository for your own private development	✅ Yes
Modify the game for yourself	✅ Yes
Run your modified game locally	✅ Yes
Run a private server for yourself and a few invited friends	✅ Yes
Put your fork on a public website	❌ No
Run a publicly accessible game server	❌ No
Publish your modified fork for others to download	❌ No
Sell the game or a modified version	❌ No
Use the game commercially	❌ No
Want To Host It Publicly?

That's possible with permission.

If you'd like to operate a public server, create a publicly distributed fork, or use the game commercially, contact nomad.idle@gmail.com. We may grant a separate license allowing those activities.
Third-Party Software

This project uses third-party software and libraries that are licensed separately from this project.

For example, React and other open-source dependencies retain their original licenses. The license for Nomad Idle does not replace or restrict the rights granted by those third-party licenses.

See THIRD-PARTY-LICENSES.md for information about third-party components and their applicable licenses.
In Short

Public source code? Yes.
Private fork? Yes.
Private modified copy? Yes.
Private server for you and a few invited friends? Yes.
Public fork? No.
Public server? No.
Commercial use? No.
Selling the game or a fork? No.
Want to do any of those things? Ask for permission.

The complete terms are in the LICENSE file.
