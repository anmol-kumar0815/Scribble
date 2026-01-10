## Setup Instructions

### 1. Install Ruby
```bash
rbenv install 3.1.3
```

### 2. Install Ruby Dependencies
```bash
bundle install
```

### 3. Install Node & Frontend Dependencies
```bash
nvm install
yarn install
```

### 4. Run Setup Script
```bash
./bin/setup
```

## Running the Application (Development Environment)
You need to run the following three processes in parallel.
### 1. Start Rails Server
```bash
bundle exec rails s
```

### 2. Start Webpack Dev Server (React)
```bash
./bin/webpack-dev-server
```

### 3. Start Sidekiq
```bash
bundle exec sidekiq
```

Once all services are running, visit:
http://localhost:3000

## Running Tests
```bash
bundle exec rails test
```

## Notes
- Ensure Redis is running before starting Sidekiq.
- Restart webpack-dev-server if frontend changes are not reflected.
