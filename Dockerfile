FROM ruby:3.1.3

# Set working directory
WORKDIR /app

# Install dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Install Node.js and Yarn
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g yarn

# Clear yarn cache
RUN yarn cache clean

# Install JavaScript dependencies
RUN yarn install --frozen-lockfile

# Start the Rails server
CMD ["rails", "server", "-b", "0.0.0.0"]
